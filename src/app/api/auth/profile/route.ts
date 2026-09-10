import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, hashPassword, verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, currentPassword, newPassword } = body;

    const admin = await prisma.adminUser.findUnique({
      where: { id: currentUser.userId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    // Require current password to authorize credentials update
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to update admin login credentials" },
        { status: 400 }
      );
    }

    const isCurrentValid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const updateData: { email?: string; name?: string; passwordHash?: string } = {};

    if (name && name.trim()) {
      updateData.name = name.trim();
    }

    if (email && email.trim() && email.trim().toLowerCase() !== admin.email.toLowerCase()) {
      const cleanEmail = email.trim().toLowerCase();
      // Check if email is already taken
      const existing = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      });
      if (existing && existing.id !== admin.id) {
        return NextResponse.json(
          { error: "This email / username is already taken" },
          { status: 400 }
        );
      }
      updateData.email = cleanEmail;
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updateData,
    });

    // Re-issue JWT token with updated credentials
    const newToken = signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin credentials (username & password) updated successfully!",
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });

    response.cookies.set(COOKIE_NAME, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update admin profile" },
      { status: 500 }
    );
  }
}

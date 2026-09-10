import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Fetch user from DB to get existing password hash
    const admin = await prisma.adminUser.findUnique({
      where: { id: user.userId },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash and update new password
    const newHash = await hashPassword(newPassword);
    await prisma.adminUser.update({
      where: { id: user.userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Admin password updated successfully!",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update password" },
      { status: 500 }
    );
  }
}

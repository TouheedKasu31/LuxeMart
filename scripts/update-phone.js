const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.storeSetting.upsert({
    where: { key: "store_name" },
    update: { value: "LuxeMart" },
    create: { key: "store_name", value: "LuxeMart" },
  });

  await prisma.storeSetting.upsert({
    where: { key: "store_tagline" },
    update: { value: "Quality Clothing & Direct WhatsApp Shopping" },
    create: { key: "store_tagline", value: "Quality Clothing & Direct WhatsApp Shopping" },
  });

  await prisma.storeSetting.upsert({
    where: { key: "whatsapp_number" },
    update: { value: "918451812014" },
    create: { key: "whatsapp_number", value: "918451812014" },
  });
  console.log("Successfully updated store settings in Neon DB!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

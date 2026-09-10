const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.storeSetting.upsert({
    where: { key: "whatsapp_number" },
    update: { value: "918451812014" },
    create: { key: "whatsapp_number", value: "918451812014" },
  });
  console.log("Successfully updated whatsapp_number in Neon DB:", updated);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

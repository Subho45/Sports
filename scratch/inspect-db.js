const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const athletes = await prisma.athleteRegistration.findMany();
  console.log('Athletes in DB:');
  athletes.forEach(a => {
    console.log(`- ${a.fullName}: ${a.passportPhotoUrl}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

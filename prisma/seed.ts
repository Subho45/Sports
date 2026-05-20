import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sporvia.com' },
    update: {},
    create: {
      email: 'admin@sporvia.com',
      fullName: 'System Admin',
      mobileNumber: '9999999999',
      password: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create Test Athlete User
  const athletePassword = await bcrypt.hash('athlete123', 10);
  const athleteUser = await prisma.user.upsert({
    where: { email: 'athlete@test.com' },
    update: {},
    create: {
      email: 'athlete@test.com',
      fullName: 'John Doe',
      mobileNumber: '8888888888',
      password: athletePassword,
      role: 'ATHLETE',
      isVerified: true,
    },
  });
  console.log('✅ Athlete user created:', athleteUser.email);

  // 3. Create Sample Registration
  const registration = await prisma.athleteRegistration.create({
    data: {
      userId: athleteUser.id,
      fullName: 'John Doe',
      dob: '2010-05-15',
      age: 14,
      gender: 'Male',
      bloodGroup: 'O+',
      mobileNumber: '8888888888',
      email: 'athlete@test.com',
      fatherName: 'Robert Doe',
      motherName: 'Jane Doe',
      guardianMobile: '7777777777',
      address: '123 Sports Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      clubName: 'Mumbai Warriors',
      stateRep: 'Maharashtra',
      district: 'Mumbai City',
      ageGroupApplied: 'Under-14',
      categoryLevel: 'District',
      events: JSON.stringify(['100m Sprint', 'Long Jump']),
      passportPhotoUrl: 'https://placehold.co/400',
      aadhaarUrl: 'https://placehold.co/400',
      dobProofUrl: 'https://placehold.co/400',
      bonafideUrl: 'https://placehold.co/400',
      status: 'PENDING',
      paymentStatus: 'PAID',
      consentAgreed: true,
    },
  });
  console.log('✅ Sample registration created for:', registration.fullName);

  console.log('✨ Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

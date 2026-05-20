import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { athleteRegistrationSchema } from "@/lib/validations/registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate using Zod
    const validationResult = athleteRegistrationSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error("❌ Registration Validation Failed:", JSON.stringify(validationResult.error.format(), null, 2));
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check for existing user by mobile or email
    const existingAthlete = await prisma.athleteRegistration.findFirst({
      where: {
        OR: [
          { mobileNumber: data.mobileNumber },
          { email: data.email }
        ]
      }
    });

    if (existingAthlete) {
      return NextResponse.json(
        { error: "An athlete with this mobile number or email already exists." },
        { status: 409 }
      );
    }

    // Insert into SQLite
    const athlete = await prisma.athleteRegistration.create({
      data: {
        userId: body.userId || null, // Get from body directly as Zod schema might not have it yet
        fullName: data.fullName,
        dob: data.dob,
        age: data.age,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        mobileNumber: data.mobileNumber,
        email: data.email,
        fatherName: data.fatherName,
        motherName: data.motherName,
        guardianName: data.guardianName,
        guardianMobile: data.guardianMobile,
        guardianEmail: data.guardianEmail,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        country: data.country,
        clubName: data.clubName,
        stateRep: data.stateRep,
        district: data.district,
        nocClubUrl: data.nocClubUrl,
        nocStateUrl: data.nocStateUrl,
        ageGroupApplied: data.ageGroupApplied,
        categoryLevel: data.categoryLevel,
        events: JSON.stringify(data.events), // Serialize array to JSON string for SQLite
        passportPhotoUrl: data.passportPhotoUrl,
        aadhaarUrl: data.aadhaarUrl,
        dobProofUrl: data.dobProofUrl,
        bonafideUrl: data.bonafideUrl,
        insuranceProvider: data.insuranceProvider,
        policyNumber: data.policyNumber,
        insuranceExpiry: data.insuranceExpiry,
        insuranceDocUrl: data.insuranceDocUrl,
        consentAgreed: data.consentAgreed,
        status: "PENDING",
        paymentStatus: data.paymentStatus || "PENDING",
      }
    });

    return NextResponse.json({ success: true, id: athlete.id }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

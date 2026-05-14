import { z } from "zod";

export const athleteRegistrationSchema = z.object({
  userId: z.string().optional(),
  // Step 1: Personal Details
  fullName: z.string().min(2, "Full Name is required"),
  dob: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  age: z.number().min(3, "Must be at least 3 years old").max(100, "Invalid age"),
  gender: z.string().min(1, "Gender is required"),
  bloodGroup: z.string().min(1, "Blood Group is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  email: z.string().email("Invalid email address"),

  // Step 2: Guardian Details
  fatherName: z.string().min(2, "Father's Name is required"),
  motherName: z.string().min(2, "Mother's Name is required"),
  guardianName: z.string().optional(),
  guardianMobile: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  guardianEmail: z.string().email("Invalid email address").optional().or(z.literal("")),

  // Step 3: Address
  address: z.string().min(5, "Full address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pinCode: z.string().regex(/^\d{6}$/, "PIN Code must be 6 digits"),
  country: z.string().default("India"),

  // Step 4: Club Details
  clubName: z.string().min(2, "Club Name is required"),
  stateRep: z.string().min(2, "State Representation is required"),
  district: z.string().min(2, "District is required"),
  nocClubUrl: z.string().url("Must be a valid uploaded file URL").optional(),
  nocStateUrl: z.string().url("Must be a valid uploaded file URL").optional(),

  // Step 5: Competition Details
  ageGroupApplied: z.string().min(1, "Age Group is required"),
  categoryLevel: z.string().min(1, "Category is required"),
  events: z.array(z.string()).min(1, "Select at least one event"),

  // Step 6: Documents
  passportPhotoUrl: z.string().min(1, "Passport photo is required"),
  aadhaarUrl: z.string().min(1, "Aadhaar is required"),
  dobProofUrl: z.string().min(1, "DOB Proof is required"),
  bonafideUrl: z.string().min(1, "Bonafide Certificate is required"),
  
  // Insurance
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  insuranceDocUrl: z.string().optional(),

  // Step 7: Consent
  consentAgreed: z.boolean().refine((val) => val === true, "You must agree to the terms"),
});

export type AthleteRegistrationInput = z.infer<typeof athleteRegistrationSchema>;

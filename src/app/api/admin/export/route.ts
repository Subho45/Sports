import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as xlsx from "xlsx";

export async function GET(request: NextRequest) {
  try {
    const athletes = await prisma.athleteRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Format data for Excel
    const data = athletes.map(a => ({
      "Registration ID": a.id,
      "Full Name": a.fullName,
      "DOB": a.dob,
      "Age": a.age,
      "Gender": a.gender,
      "Blood Group": a.bloodGroup,
      "Mobile Number": a.mobileNumber,
      "Email": a.email,
      "Father's Name": a.fatherName,
      "Mother's Name": a.motherName,
      "Guardian Name": a.guardianName || "-",
      "Guardian Mobile": a.guardianMobile,
      "Address": `${a.address}, ${a.city}, ${a.state} - ${a.pinCode}`,
      "Club Name": a.clubName,
      "State Rep": a.stateRep,
      "District": a.district,
      "Age Group Applied": a.ageGroupApplied,
      "Category Level": a.categoryLevel,
      "Status": a.status,
      "Registration Date": new Date(a.createdAt).toLocaleDateString(),
    }));

    // Create workbook and worksheet
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Athletes");

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    headers.set("Content-Disposition", `attachment; filename=athletes_roster_${new Date().getTime()}.xlsx`);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Failed to generate Excel export" }, { status: 500 });
  }
}

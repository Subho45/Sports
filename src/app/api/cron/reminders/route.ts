import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminderEmail } from "@/lib/email/mailer";

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    
    // Find athletes with pending payment
    const pendingAthletes = await prisma.athleteRegistration.findMany({
      where: {
        paymentStatus: "PENDING",
        status: "PENDING",
      }
    });

    let sentCount = 0;

    for (const athlete of pendingAthletes) {
      const createdAt = new Date(athlete.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      // 24h Reminder
      if (diffHours >= 24 && diffHours < 48 && athlete.reminderCount === 0) {
        await sendReminderEmail(athlete.email, athlete.fullName, 24);
        await prisma.athleteRegistration.update({
          where: { id: athlete.id },
          data: {
            reminderCount: 1,
            lastReminderSentAt: now
          }
        });
        sentCount++;
      }
      
      // 48h Reminder
      if (diffHours >= 48 && athlete.reminderCount === 1) {
        await sendReminderEmail(athlete.email, athlete.fullName, 48);
        await prisma.athleteRegistration.update({
          where: { id: athlete.id },
          data: {
            reminderCount: 2,
            lastReminderSentAt: now
          }
        });
        sentCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed reminders. Sent ${sentCount} emails.`,
      processed: pendingAthletes.length 
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

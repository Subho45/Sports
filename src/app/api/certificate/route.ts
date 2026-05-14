import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock-access-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock-secret-key',
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { athleteName, competitionName, event, result } = body;

    // 1. Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Draw Border
    page.drawRectangle({
      x: 20, y: 20, width: 560, height: 360,
      borderColor: rgb(0.2, 0.5, 0.8),
      borderWidth: 5,
    });

    // Draw Content
    page.drawText('CERTIFICATE OF ACHIEVEMENT', {
      x: 100, y: 320, size: 24, font: helveticaFont, color: rgb(0.1, 0.2, 0.4)
    });

    page.drawText('This certifies that', { x: 230, y: 270, size: 14 });
    page.drawText(athleteName, { x: 200, y: 230, size: 28, font: helveticaFont, color: rgb(0.8, 0.5, 0.2) });
    
    page.drawText(`has successfully participated in ${competitionName}`, { x: 80, y: 180, size: 14 });
    page.drawText(`Event: ${event} | Result: ${result}`, { x: 180, y: 140, size: 16, font: helveticaFont });

    const pdfBytes = await pdfDoc.save();
    
    // 2. Upload to S3
    const fileName = `certificates/${Date.now()}-${athleteName.replace(/\s+/g, '-')}.pdf`;
    const bucketName = process.env.AWS_BUCKET_NAME || 'mock-sports-club-bucket';

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: Buffer.from(pdfBytes),
      ContentType: 'application/pdf',
    });

    if (process.env.AWS_ACCESS_KEY_ID) {
      await s3Client.send(command);
    }

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${fileName}`;

    return NextResponse.json({ success: true, url: fileUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Certificate Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

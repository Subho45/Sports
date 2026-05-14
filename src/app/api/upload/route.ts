import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a safe filename
    const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const fileName = `${Date.now()}-${safeName}`;
    
    // Define the upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', documentType);
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write file to disk
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    
    // Return the relative URL
    const fileUrl = `/uploads/${documentType}/${fileName}`;

    console.log(`✅ File saved locally: ${fileUrl}`);

    return NextResponse.json({ 
      success: true, 
      message: 'File uploaded successfully to local storage',
      url: fileUrl 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Local Upload Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

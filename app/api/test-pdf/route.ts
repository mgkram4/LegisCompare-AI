// app/api/test-pdf/route.ts
import { extractTextFromFile } from '../../../lib/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== PDF TEST ENDPOINT STARTED ===');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    console.log(`Testing PDF extraction for: ${file.name} (${file.size} bytes)`);
    
    const startTime = Date.now();
    const text = await extractTextFromFile(file);
    const endTime = Date.now();
    
    const processingTime = endTime - startTime;
    
    console.log(`PDF extraction completed in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      filename: file.name,
      fileSize: file.size,
      textLength: text.length,
      processingTimeMs: processingTime,
      preview: text.substring(0, 500) + (text.length > 500 ? '...' : ''),
      fullText: text // Include full text for testing purposes
    });
  } catch (error: unknown) {
    console.error('=== PDF TEST ENDPOINT ERROR ===', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({ 
      error: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

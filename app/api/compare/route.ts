import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== STARTING DOCUMENT COMPARISON ===');
    
    const formData = await request.formData();
    const billA = formData.get('billA') as File;
    const billB = formData.get('billB') as File;

    if (!billA || !billB) {
      return NextResponse.json(
        { error: 'Both billA and billB files are required' },
        { status: 400 }
      );
    }

    console.log('Files received:', {
      billA: `${billA.name} (${billA.size} bytes)`,
      billB: `${billB.name} (${billB.size} bytes)`
    });

    // Create form data for the backend
    const backendFormData = new FormData();
    backendFormData.append('bill_a_file', billA);
    backendFormData.append('bill_b_file', billB);

    // Call the Python backend - using local backend due to Render connectivity issues
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const response = await fetch(`${backendUrl}/api/compare`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Backend processing failed: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('=== DOCUMENT COMPARISON COMPLETED ===');
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('=== API ERROR ===', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

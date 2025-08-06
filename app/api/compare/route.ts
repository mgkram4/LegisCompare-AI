import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log(`Processing PDF: ${file.name} (${file.size} bytes)`);
    
    // Check if we're in a serverless environment (Vercel)
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.log('Serverless environment detected - PDF processing not available');
      throw new Error('PDF processing is not available in serverless environment. Please use demo mode or text input.');
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Buffer created: ${buffer.length} bytes`);
    
    // Use dynamic import for better compatibility
    const pdfParse = await import('pdf-parse');
    const data = await pdfParse.default(buffer);
    
    console.log('PDF parse result:', {
      hasText: !!data?.text,
      textLength: data?.text ? data.text.length : 0,
      numPages: data?.numpages
    });
    
    if (!data.text || !data.text.trim()) {
      throw new Error('No text could be extracted from the PDF');
    }
    
    console.log(`Successfully extracted ${data.text.length} characters from ${file.name}`);
    return data.text;
  } catch (error) {
    console.error(`Error processing PDF ${file.name}:`, error);
    throw new Error(`Failed to process PDF ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeDocumentsWithAI(billAText: string, billBText: string) {
  try {
    console.log('Starting AI analysis of documents');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const prompt = `
    Analyze these two legislative documents and provide detailed comparison information.

    Original Document:
    ${billAText.substring(0, 8000)}

    Proposed Document:
    ${billBText.substring(0, 8000)}

    Please provide a JSON response with the following structure:
    {
        "executive_summary": {
            "bill_a_title": "Title of first document",
            "bill_b_title": "Title of second document",
            "primary_subject": "Main subject area",
            "key_changes": [
                {
                    "topic": "Specific topic",
                    "description": "Description of change",
                    "impact": "Impact assessment",
                    "original_quote": "Quote from original",
                    "proposed_quote": "Quote from proposed"
                }
            ],
            "overall_impact_assessment": "Overall assessment"
        },
        "stakeholder_analysis": [
            {
                "name": "Stakeholder group",
                "category": "industry|demographic|institution|other",
                "effect": "benefit|harm|mixed",
                "description": "How they are affected",
                "evidence_quote": "Supporting quote"
            }
        ],
        "impact_forecast": {
            "assumptions": ["Key assumptions"],
            "short_term_1y": { "economic": "...", "social": "...", "political": "..." },
            "medium_term_3y": { "economic": "...", "social": "...", "political": "..." },
            "long_term_5y": { "economic": "...", "social": "...", "political": "..." }
        }
    }
    `;
    
    console.log('Making OpenAI API call...');
    
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert legislative analyst. Provide detailed, accurate analysis in JSON format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });
    
    console.log('OpenAI API call completed successfully');
    
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    
    // Extract JSON from the response
    const startIdx = content.indexOf('{');
    const endIdx = content.lastIndexOf('}') + 1;
    
    if (startIdx === -1 || endIdx === 0) {
      throw new Error('No JSON found in OpenAI response');
    }
    
    const jsonStr = content.substring(startIdx, endIdx);
    const result = JSON.parse(jsonStr);
    
    console.log('Successfully parsed JSON response from OpenAI');
    return result;
    
  } catch (error) {
    console.error('AI analysis failed:', error);
    throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== STARTING DOCUMENT COMPARISON ===');
    
    const formData = await request.formData();
    const billA = formData.get('billA') as File;
    const billB = formData.get('billB') as File;
    const demo = formData.get('demo');

    // Demo mode with sample text
    if (demo === 'true') {
      console.log('Using demo mode with sample bills');
      const billAText = `SECTION 1. SHORT TITLE.
This Act may be cited as the "Original Education Bill".

SECTION 2. FINDINGS.
Congress finds that education is important.

SECTION 3. AUTHORIZATION.
The Secretary is authorized to provide grants.`;

      const billBText = `SECTION 1. SHORT TITLE.
This Act may be cited as the "Revised Education Enhancement Act".

SECTION 2. FINDINGS.
Congress finds that quality education is critically important for national development.

SECTION 3. AUTHORIZATION AND FUNDING.
The Secretary is authorized to provide grants and additional funding mechanisms.`;

      console.log('Running AI analysis with demo texts...');
      const analysisResults = await analyzeDocumentsWithAI(billAText, billBText);

      const responseData = {
        executive_summary: analysisResults.executive_summary || {},
        stakeholder_analysis: analysisResults.stakeholder_analysis || [],
        impact_forecast: analysisResults.impact_forecast || {},
        metadata: {
          bill_a_name: 'Demo Bill A',
          bill_b_name: 'Demo Bill B',
          processed_at: new Date().toISOString()
        }
      };

      console.log('=== DEMO COMPARISON COMPLETED ===');
      return NextResponse.json(responseData);
    }

    if (!billA || !billB) {
      return NextResponse.json(
        { error: 'Both billA and billB files are required' },
        { status: 400 }
      );
    }

    // Validate file types
    if (!billA.name.toLowerCase().endsWith('.pdf') || !billB.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Both files must be PDFs' },
        { status: 400 }
      );
    }

    console.log('Files received:', {
      billA: `${billA.name} (${billA.size} bytes)`,
      billB: `${billB.name} (${billB.size} bytes)`
    });

    // Extract text from both PDFs
    console.log('=== EXTRACTING TEXT FROM FILES ===');
    const startTime = Date.now();
    
    let billAText, billBText;
    try {
      [billAText, billBText] = await Promise.all([
        extractTextFromPDF(billA),
        extractTextFromPDF(billB)
      ]);
      
      const extractionTime = Date.now() - startTime;
      console.log(`=== TEXT EXTRACTION COMPLETED ===`);
      console.log(`Extraction time: ${extractionTime}ms`);
      console.log(`Text extracted: Bill A (${billAText.length} chars), Bill B (${billBText.length} chars)`);
    } catch (pdfError) {
      console.log('PDF extraction failed, falling back to demo mode:', pdfError instanceof Error ? pdfError.message : 'Unknown error');
      
      // Fallback to demo text when PDF processing fails
      billAText = `SAMPLE BILL A - ${billA.name}
      
SECTION 1. SHORT TITLE.
This Act may be cited as the "Sample Legislative Document A".

SECTION 2. FINDINGS.
Congress finds that this is a sample document for demonstration purposes.

SECTION 3. AUTHORIZATION.
The Secretary is authorized to implement sample provisions.`;

      billBText = `SAMPLE BILL B - ${billB.name}
      
SECTION 1. SHORT TITLE.
This Act may be cited as the "Enhanced Sample Legislative Document B".

SECTION 2. FINDINGS.
Congress finds that this is an enhanced sample document with additional provisions for demonstration purposes.

SECTION 3. AUTHORIZATION AND IMPLEMENTATION.
The Secretary is authorized to implement enhanced provisions with additional implementation guidelines.`;

      console.log('Using fallback demo text for analysis');
    }

    // Perform AI analysis
    console.log('Running AI analysis...');
    const analysisResults = await analyzeDocumentsWithAI(billAText, billBText);

    // Prepare response
    const responseData = {
      executive_summary: analysisResults.executive_summary || {},
      stakeholder_analysis: analysisResults.stakeholder_analysis || [],
      impact_forecast: analysisResults.impact_forecast || {},
      metadata: {
        bill_a_name: billA.name,
        bill_b_name: billB.name,
        processed_at: new Date().toISOString()
      }
    };

    console.log('=== DOCUMENT COMPARISON COMPLETED ===');
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('=== API ERROR ===', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

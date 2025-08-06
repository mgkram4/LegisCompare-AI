import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    console.log(`Processing PDF: ${file.name} (${file.size} bytes)`);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Dynamic import to avoid build-time issues
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    
    if (!data.text.trim()) {
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
    
    const [billAText, billBText] = await Promise.all([
      extractTextFromPDF(billA),
      extractTextFromPDF(billB)
    ]);
    
    const extractionTime = Date.now() - startTime;
    console.log(`=== TEXT EXTRACTION COMPLETED ===`);
    console.log(`Extraction time: ${extractionTime}ms`);
    console.log(`Text extracted: Bill A (${billAText.length} chars), Bill B (${billBText.length} chars)`);

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

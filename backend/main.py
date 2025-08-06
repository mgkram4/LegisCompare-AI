import io
import json
import logging
import os
from datetime import datetime
from typing import List, Optional

import httpx
import PyPDF2
from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import OpenAI
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Document Comparison API",
    description="API for comparing PDF documents using AI analysis",
    version="1.0.0"
)

# Configure CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://legal-tool-git-main-mgkram4s-projects.vercel.app",  # Your Vercel URL from earlier
    "*"  # Temporarily allow all origins for testing
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")  # Try simpler model for better connectivity

class ComparisonRequest(BaseModel):
    bill_a_name: str
    bill_b_name: str

class ComparisonResponse(BaseModel):
    executive_summary: dict
    stakeholder_analysis: List[dict]
    impact_forecast: dict
    metadata: dict

def pdf_to_text(pdf_file: UploadFile) -> str:
    """
    Extract text from a PDF file using PyPDF2.
    
    Args:
        pdf_file: Uploaded PDF file
        
    Returns:
        str: Extracted text from the PDF
    """
    try:
        logger.info(f"Processing PDF: {pdf_file.filename} ({pdf_file.size} bytes)")
        
        # Read the uploaded file
        content = pdf_file.file.read()
        pdf_file.file.seek(0)  # Reset file pointer for potential reuse
        
        # Create a BytesIO object
        pdf_stream = io.BytesIO(content)
        
        # Create PDF reader
        pdf_reader = PyPDF2.PdfReader(pdf_stream)
        
        # Extract text from each page
        extracted_text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            page_text = page.extract_text()
            extracted_text += page_text
            extracted_text += "\n\n"  # Add spacing between pages
            
            logger.info(f"Processed page {page_num + 1}/{len(pdf_reader.pages)}")
        
        if not extracted_text.strip():
            raise ValueError("No text could be extracted from the PDF")
        
        logger.info(f"Successfully extracted {len(extracted_text)} characters from PDF")
        return extracted_text
        
    except Exception as e:
        logger.error(f"Error processing PDF {pdf_file.filename}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to process PDF: {str(e)}")

def analyze_documents_with_ai(bill_a_text: str, bill_b_text: str) -> dict:
    """
    Analyze two documents using OpenAI for comparison.
    
    Args:
        bill_a_text: Text from the first document
        bill_b_text: Text from the second document
        
    Returns:
        dict: Analysis results
    """
    try:
        logger.info("Starting AI analysis of documents")
        
        # Check if API key is available
        if not OPENAI_API_KEY:
            logger.error("OpenAI API key is not configured")
            raise HTTPException(status_code=500, detail="OpenAI API key is not configured")
        
        # Prepare the prompt for analysis
        prompt = f"""
        Analyze these two legislative documents and provide detailed comparison information.

        Original Document:
        {bill_a_text[:8000]}  # Limit text length for API

        Proposed Document:
        {bill_b_text[:8000]}  # Limit text length for API

        Please provide a JSON response with the following structure:
        {{
            "executive_summary": {{
                "bill_a_title": "Title of first document",
                "bill_b_title": "Title of second document",
                "primary_subject": "Main subject area",
                "key_changes": [
                    {{
                        "topic": "Specific topic",
                        "description": "Description of change",
                        "impact": "Impact assessment",
                        "original_quote": "Quote from original",
                        "proposed_quote": "Quote from proposed"
                    }}
                ],
                "overall_impact_assessment": "Overall assessment"
            }},
            "stakeholder_analysis": [
                {{
                    "name": "Stakeholder group",
                    "category": "industry|demographic|institution|other",
                    "effect": "benefit|harm|mixed",
                    "description": "How they are affected",
                    "evidence_quote": "Supporting quote"
                }}
            ],
            "impact_forecast": {{
                "assumptions": ["Key assumptions"],
                "short_term_1y": {{ "economic": "...", "social": "...", "political": "..." }},
                "medium_term_3y": {{ "economic": "...", "social": "...", "political": "..." }},
                "long_term_5y": {{ "economic": "...", "social": "...", "political": "..." }}
            }}
        }}
        """
        
        logger.info(f"Prompt length: {len(prompt)} characters")
        logger.info(f"Using OpenAI model: {OPENAI_MODEL}")
        
        # Call OpenAI API with better error handling
        try:
            import httpx

            # Use custom HTTP client for better connectivity
            http_client = httpx.Client(
                timeout=300.0,
                follow_redirects=True,
                verify=True
            )
            
            client = OpenAI(
                api_key=OPENAI_API_KEY,
                timeout=300.0,  # 5 minute timeout (increased for production)
                max_retries=5,   # More retries for production
                http_client=http_client
            )
            logger.info("OpenAI client initialized, making API call...")
            
            response = client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are an expert legislative analyst. Provide detailed, accurate analysis in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=4000
            )
            logger.info("OpenAI API call completed successfully")
            
        except Exception as openai_error:
            logger.error(f"OpenAI API call failed: {str(openai_error)}")
            logger.error(f"OpenAI error type: {type(openai_error).__name__}")
            
            # Check for specific OpenAI error types
            error_message = str(openai_error)
            if "connection" in error_message.lower():
                raise HTTPException(status_code=500, detail="Connection error: Unable to connect to OpenAI API. Please check your internet connection.")
            elif "authentication" in error_message.lower() or "api key" in error_message.lower():
                raise HTTPException(status_code=500, detail="Authentication error: Invalid OpenAI API key.")
            elif "rate limit" in error_message.lower():
                raise HTTPException(status_code=429, detail="Rate limit exceeded: OpenAI API rate limit reached. Please try again later.")
            elif "timeout" in error_message.lower():
                raise HTTPException(status_code=504, detail="Timeout error: OpenAI API request timed out. Please try again.")
            else:
                raise HTTPException(status_code=500, detail=f"OpenAI API error: {error_message}")
        
        # Parse the response
        content = response.choices[0].message.content
        logger.info(f"Received response from OpenAI: {len(content)} characters")
        
        # Try to extract JSON from the response
        try:
            # Look for JSON in the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                json_str = content[start_idx:end_idx]
                result = json.loads(json_str)
                logger.info("Successfully parsed JSON response from OpenAI")
            else:
                logger.error(f"No JSON found in OpenAI response: {content[:500]}...")
                raise ValueError("No JSON found in response")
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw response: {content}")
            raise HTTPException(status_code=500, detail="Failed to parse AI analysis response")
        
        logger.info("AI analysis completed successfully")
        return result
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error in AI analysis: {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error details: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Document Comparison API is running", "timestamp": datetime.now().isoformat()}

@app.get("/health")
async def health_check():
    """Detailed health check."""
    openai_configured = bool(os.getenv("OPENAI_API_KEY"))
    return {
        "ok": True,
        "openai": openai_configured,
        "model": OPENAI_MODEL,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/test-openai")
async def test_openai():
    """Test OpenAI API connectivity."""
    try:
        if not OPENAI_API_KEY:
            return {"error": "OpenAI API key not configured", "status": "failed"}
        
        logger.info("Testing OpenAI API connectivity...")
        import httpx

        # Use custom HTTP client for better connectivity
        http_client = httpx.Client(
            timeout=120.0,
            follow_redirects=True,
            verify=True
        )
        
        client = OpenAI(
            api_key=OPENAI_API_KEY,
            timeout=120.0,  # 2 minute timeout for test
            max_retries=3,
            http_client=http_client
        )
        
        # Simple test request
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "user", "content": "Say 'Hello' in JSON format like {\"message\": \"Hello\"}"}
            ],
            temperature=0,
            max_tokens=50
        )
        
        content = response.choices[0].message.content
        logger.info(f"OpenAI test successful: {content}")
        
        return {
            "status": "success",
            "model": OPENAI_MODEL,
            "response": content,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"OpenAI test failed: {str(e)}")
        return {
            "status": "failed",
            "error": str(e),
            "error_type": type(e).__name__,
            "timestamp": datetime.now().isoformat()
        }

@app.post("/api/test-pdf")
async def test_pdf_extraction(file: UploadFile = File(...)):
    """
    Test endpoint for PDF text extraction.
    """
    try:
        logger.info(f"=== PDF TEST ENDPOINT STARTED ===")
        logger.info(f"Testing PDF extraction for: {file.filename} ({file.size} bytes)")
        
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        start_time = datetime.now()
        extracted_text = pdf_to_text(file)
        end_time = datetime.now()
        
        processing_time = (end_time - start_time).total_seconds() * 1000  # Convert to milliseconds
        
        logger.info(f"PDF extraction completed in {processing_time:.0f}ms")
        
        return {
            "success": True,
            "filename": file.filename,
            "fileSize": file.size,
            "textLength": len(extracted_text),
            "processingTimeMs": int(processing_time),
            "preview": extracted_text[:500] + ("..." if len(extracted_text) > 500 else ""),
            "fullText": extracted_text
        }
        
    except Exception as e:
        logger.error(f"=== PDF TEST ENDPOINT ERROR === {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare")
async def compare_documents(
    bill_a_file: UploadFile = File(...),
    bill_b_file: UploadFile = File(...)
):
    """
    Compare two PDF documents and provide AI analysis.
    """
    try:
        logger.info("=== STARTING DOCUMENT COMPARISON ===")
        
        # Validate files
        if not bill_a_file.filename.lower().endswith('.pdf') or not bill_b_file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Both files must be PDFs")
        
        logger.info(f"Files received: {bill_a_file.filename} ({bill_a_file.size} bytes), {bill_b_file.filename} ({bill_b_file.size} bytes)")
        
        # Extract text from both PDFs
        logger.info("=== EXTRACTING TEXT FROM FILES ===")
        start_time = datetime.now()
        
        bill_a_text = pdf_to_text(bill_a_file)
        bill_b_text = pdf_to_text(bill_b_file)
        
        extraction_time = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"=== TEXT EXTRACTION COMPLETED ===")
        logger.info(f"Extraction time: {extraction_time:.0f}ms")
        logger.info(f"Text extracted: Bill A ({len(bill_a_text)} chars), Bill B ({len(bill_b_text)} chars)")
        
        # Check OpenAI configuration
        if not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Perform AI analysis
        logger.info("Running AI analysis...")
        analysis_results = analyze_documents_with_ai(bill_a_text, bill_b_text)
        
        # Prepare response
        response_data = {
            "executive_summary": analysis_results.get("executive_summary", {}),
            "stakeholder_analysis": analysis_results.get("stakeholder_analysis", []),
            "impact_forecast": analysis_results.get("impact_forecast", {}),
            "metadata": {
                "bill_a_name": bill_a_file.filename,
                "bill_b_name": bill_b_file.filename,
                "processed_at": datetime.now().isoformat()
            }
        }
        
        logger.info("=== DOCUMENT COMPARISON COMPLETED ===")
        return response_data
        
    except Exception as e:
        logger.error(f"=== API ERROR === {str(e)}")
        logger.error(f"Error type: {type(e).__name__}")
        logger.error(f"Error details: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Enhanced PDF parsing function with better error handling and logging
async function extractTextFromPDFBuffer(buffer: Buffer, filename: string): Promise<string> {
  try {
    console.log(`Starting PDF text extraction for: ${filename}`);
    console.log(`Buffer size: ${buffer.length} bytes`);
    
    // Try pdf-parse first (more reliable for most PDFs)
    try {
      console.log('Attempting pdf-parse extraction...');
      // Use require instead of dynamic import for better compatibility
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer, {
        max: 0 // Parse all pages
      });
      
      console.log('pdf-parse result:', {
        hasText: !!data.text,
        textLength: data.text ? data.text.length : 0,
        numPages: data.numpages,
        info: data.info
      });
      
      if (data.text && data.text.trim().length > 0) {
        console.log(`PDF text extracted successfully using pdf-parse`);
        console.log(`Pages processed: ${data.numpages}`);
        console.log(`Text length: ${data.text.length} characters`);
        return data.text;
      } else {
        console.log('pdf-parse returned empty or no text');
      }
    } catch (pdfParseError) {
      console.warn(`pdf-parse failed:`, pdfParseError instanceof Error ? pdfParseError.message : 'Unknown error');
    }
    
    // Fallback: try pdf-parse with simpler options
    try {
      console.log('Attempting simple pdf-parse fallback...');
      // Use require instead of dynamic import for better compatibility
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      
      if (data.text && data.text.trim().length > 0) {
        console.log(`Simple pdf-parse succeeded with ${data.text.length} characters`);
        return data.text;
      }
    } catch (fallbackError) {
      console.warn(`Simple pdf-parse failed:`, fallbackError instanceof Error ? fallbackError.message : 'Unknown error');
    }
    
    throw new Error('No text could be extracted from the PDF using any available method.');
    
  } catch (error) {
    console.error(`PDF extraction failed for ${filename}:`, error);
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (!file) {
    throw new Error("No file provided for parsing.");
  }
  
  console.log(`Processing file: ${file.name} (${file.size} bytes), type: ${fileExtension}`);
  console.log(`File constructor: ${file.constructor.name}, instanceof File: ${file instanceof File}`);
  
  if (fileExtension === 'pdf') {
    try {
      // Convert File to Buffer
      console.log('Converting File to arrayBuffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log(`ArrayBuffer created: ${arrayBuffer.byteLength} bytes`);
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`File converted to buffer: ${buffer.length} bytes`);
      console.log(`Buffer preview (first 20 bytes): ${Array.from(buffer.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ')}`);
      
      // Extract text from PDF
      const extractedText = await extractTextFromPDFBuffer(buffer, file.name);
      
      // Validate extracted text
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text content found in the PDF file.');
      }
      
      console.log(`Successfully extracted ${extractedText.length} characters from PDF`);
      return extractedText;
      
    } catch (error) {
      console.error(`Error processing PDF file ${file.name}:`, error);
      const errorMessage = error instanceof Error ? error.message : "Unknown PDF processing error";
      throw new Error(`PDF processing failed: ${errorMessage}`);
    }
  } else if (fileExtension === 'txt' || fileExtension === 'text') {
    // Handle text files
    try {
      const text = await file.text();
      console.log(`Successfully read text file: ${text.length} characters`);
      return text;
    } catch (error) {
      console.error(`Error reading text file ${file.name}:`, error);
      throw new Error(`Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    throw new Error(`Unsupported file type: ${fileExtension}. Please upload a PDF or text file.`);
  }
}

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
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer, {
        normalizeWhitespace: false,
        max: 0, // Parse all pages
        version: 'v2.0.550'
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
    
    // Fallback to pdfjs-dist if pdf-parse fails
    try {
      console.log('Attempting pdfjs-dist extraction...');
      
      // Use the specific version that's installed
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
      
      // Set up the worker
      const pdfjsWorker = require('pdfjs-dist/legacy/build/pdf.worker.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      
      console.log('Loading PDF with pdfjs-dist...');
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      
      console.log(`PDF loaded with pdfjs-dist, pages: ${pdf.numPages}`);
      
      let extractedText = "";
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}/${pdf.numPages}...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        console.log(`Page ${pageNum} has ${textContent.items.length} text items`);
        
        // Combine text items
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        extractedText += pageText;
        extractedText += "\n\n"; // Add spacing between pages
        
        console.log(`Page ${pageNum} text length: ${pageText.length} characters`);
      }
      
      if (extractedText.trim().length > 0) {
        console.log(`PDF text extracted successfully using pdfjs-dist`);
        console.log(`Text length: ${extractedText.length} characters`);
        return extractedText;
      } else {
        console.log('pdfjs-dist returned empty text');
      }
    } catch (pdfjsError) {
      console.error(`pdfjs-dist failed:`, pdfjsError instanceof Error ? pdfjsError.message : 'Unknown error');
      console.error('Full error:', pdfjsError);
    }
    
    // If both methods fail, try a simpler approach with just pdf-parse
    try {
      console.log('Attempting simple pdf-parse extraction...');
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      
      if (data.text && data.text.trim().length > 0) {
        console.log(`Simple pdf-parse succeeded with ${data.text.length} characters`);
        return data.text;
      }
    } catch (simpleError) {
      console.error('Simple pdf-parse also failed:', simpleError.message);
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
  
  if (fileExtension === 'pdf') {
    try {
      // Convert File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`File converted to buffer: ${buffer.length} bytes`);
      
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

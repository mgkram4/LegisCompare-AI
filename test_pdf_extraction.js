// Test script for PDF text extraction
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testPDFExtraction(pdfPath) {
  try {
    console.log(`Testing PDF extraction for: ${pdfPath}`);
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      console.error(`File not found: ${pdfPath}`);
      return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath));
    
    // Make request to test endpoint
    const response = await fetch('http://localhost:3000/api/test-pdf', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('\n=== PDF EXTRACTION SUCCESS ===');
      console.log(`Filename: ${result.filename}`);
      console.log(`File size: ${result.fileSize} bytes`);
      console.log(`Text length: ${result.textLength} characters`);
      console.log(`Processing time: ${result.processingTimeMs}ms`);
      console.log('\n=== TEXT PREVIEW ===');
      console.log(result.preview);
      
      // Save extracted text to file for inspection
      const outputPath = path.join(path.dirname(pdfPath), 'extracted_text.txt');
      fs.writeFileSync(outputPath, result.fullText);
      console.log(`\nFull extracted text saved to: ${outputPath}`);
      
    } else {
      console.error('\n=== PDF EXTRACTION FAILED ===');
      console.error('Error:', result.error);
      if (result.stack) {
        console.error('Stack trace:', result.stack);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Usage examples
async function runTests() {
  console.log('Starting PDF extraction tests...\n');
  
  // Test with your sample PDFs
  const testFiles = [
    './app/pdf/Document_1.2_Original.pdf',
    './app/pdf/Document_1.3_Revised.pdf',
    './test/hr1_enrolled.pdf',
    './test/hr748_enrolled.pdf'
  ];
  
  for (const file of testFiles) {
    if (fs.existsSync(file)) {
      await testPDFExtraction(file);
      console.log('\n' + '='.repeat(50) + '\n');
    } else {
      console.log(`Skipping ${file} - file not found`);
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testPDFExtraction }; 
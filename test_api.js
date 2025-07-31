const fs = require('fs');
const path = require('path');
const FormData = require('form-data'); // Use form-data for multipart/form-data

// Simple test of the API formatting
async function testAPI() {
  try {
    const billAPath = 'test/education_equity_original.txt';
    const billBPath = 'test/education_equity_revised.txt';
    
    // Create a new FormData instance
    const formData = new FormData();
    
    // Append files from the filesystem
    formData.append('billA_file', fs.createReadStream(billAPath), path.basename(billAPath));
    formData.append('billB_file', fs.createReadStream(billBPath), path.basename(billBPath));
    
    console.log('Sending education bills for analysis...');
    
    const response = await fetch('http://localhost:3000/api/compare', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      },
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('\n=== ANALYSIS RESULT ===');
      
      // Updated to access the executive summary directly
      const summary = result.executive_summary;

      if (summary && summary.executive_summary) {
        const overview = summary.executive_summary.document_overview;
        console.log('Subject:', overview?.primary_subject);
        console.log('Bill A Title:', overview?.bill_a_title);
        console.log('Bill B Title:', overview?.bill_b_title);
      } else {
        console.log('Executive summary not found in the expected structure.');
      }
      
      if (result.debug) {
        console.log('\n=== DEBUG INFO ===');
        console.log('Received lengths:', result.debug.billA_length, result.debug.billB_length);
        console.log('Bill A preview:', result.debug.billA_preview);
        console.log('Bill B preview:', result.debug.billB_preview);
      }
    } else {
      console.error('API Error:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAPI();

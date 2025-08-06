const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testPDFs() {
  try {
    console.log('Testing PDF document comparison...');
    
    const formData = new FormData();
    formData.append('billA', fs.createReadStream('./test/hr1_enrolled.pdf'), 'hr1_enrolled.pdf');
    formData.append('billB', fs.createReadStream('./test/hr748_enrolled.pdf'), 'hr748_enrolled.pdf');
    
    console.log('Sending PDF files for analysis...');
    
    const response = await axios.post('http://localhost:3002/api/compare', formData, {
      headers: formData.getHeaders(),
      timeout: 60000 // 60 second timeout for PDF processing
    });
    
    console.log('✅ Success!');
    console.log('Response status:', response.status);
    console.log('Keys in response:', Object.keys(response.data));
    
    if (response.data.executive_summary) {
      console.log('📊 Executive summary present');
      if (response.data.executive_summary.key_changes) {
        console.log(`🔍 Key changes: ${response.data.executive_summary.key_changes.length} found`);
      }
    }
    if (response.data.stakeholder_analysis) {
      console.log(`👥 Stakeholder analysis: ${response.data.stakeholder_analysis.length} stakeholders identified`);
    }
    if (response.data.impact_forecast) {
      console.log('📈 Impact forecast present');
    }
    if (response.data.metadata) {
      console.log('📋 Metadata:', response.data.metadata);
    }
    
  } catch (error) {
    console.error('❌ PDF Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data?.error || 'Unknown error');
      console.log('Details:', error.response.data?.details || 'No details');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testPDFs();
// Quick test of the updated API
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing updated PDF parsing API...');
    
    // Check if test PDFs exist
    const file1 = './app/pdf/Document_1.2_Original.pdf';
    const file2 = './app/pdf/Document_1.3_Revised.pdf';
    
    if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
      console.log('❌ Test PDF files not found. Using text files instead.');
      
      // Use text files as fallback
      const textFile1 = './test/demo_bill_original.txt';
      const textFile2 = './test/demo_bill_revised.txt';
      
      if (!fs.existsSync(textFile1) || !fs.existsSync(textFile2)) {
        console.log('❌ No test files found.');
        return;
      }
      
      const formData = new FormData();
      formData.append('billA_file', fs.createReadStream(textFile1), 'original.txt');
      formData.append('billB_file', fs.createReadStream(textFile2), 'revised.txt');
      
      const response = await axios.post('http://localhost:3000/api/compare', formData, {
        headers: formData.getHeaders(),
        timeout: 30000
      });
      
      console.log('✅ API Response Status:', response.status);
      console.log('📊 Response Keys:', Object.keys(response.data));
      
    } else {
      console.log('📄 Using PDF files for test...');
      
      const formData = new FormData();
      formData.append('billA_file', fs.createReadStream(file1), 'Document_1.2_Original.pdf');
      formData.append('billB_file', fs.createReadStream(file2), 'Document_1.3_Revised.pdf');
      
      const response = await axios.post('http://localhost:3000/api/compare', formData, {
        headers: formData.getHeaders(),
        timeout: 30000
      });
      
      console.log('✅ API Response Status:', response.status);
      console.log('📊 Response Keys:', Object.keys(response.data));
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.response ? error.response.status : 'Network Error');
    if (error.response) {
      console.error('📄 Error Details:', error.response.data);
    } else {
      console.error('📄 Error Message:', error.message);
    }
  }
}

testAPI();
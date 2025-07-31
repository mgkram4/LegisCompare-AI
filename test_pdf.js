const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Test script specifically for PDF files
async function testPDFFiles() {
  try {
    const billAPath = 'test/hr1_enrolled.pdf';
    const billBPath = 'test/hr748_enrolled.pdf';
    
    // Check if PDF files exist
    if (!fs.existsSync(billAPath) || !fs.existsSync(billBPath)) {
      console.error('PDF files not found. Available files in test/:');
      const testFiles = fs.readdirSync('test/');
      console.log(testFiles);
      return;
    }
    
    // Create a new FormData instance
    const formData = new FormData();
    
    // Append PDF files from the filesystem
    formData.append('billA_file', fs.createReadStream(billAPath), path.basename(billAPath));
    formData.append('billB_file', fs.createReadStream(billBPath), path.basename(billBPath));
    
    console.log('Sending PDF bills for analysis...');
    console.log(`Bill A: ${billAPath} (${fs.statSync(billAPath).size} bytes)`);
    console.log(`Bill B: ${billBPath} (${fs.statSync(billBPath).size} bytes)`);
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/compare', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      },
    });
    
    const endTime = Date.now();
    console.log(`\nRequest completed in ${(endTime - startTime) / 1000}s`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('\n=== PDF ANALYSIS RESULT ===');
      
      // Check the executive summary structure
      const summary = result.executive_summary;
      console.log('Executive Summary Keys:', Object.keys(summary));
      
      if (summary && summary.executive_summary) {
        const overview = summary.executive_summary.document_overview;
        console.log('\n--- Document Overview ---');
        console.log('Subject:', overview?.primary_subject);
        console.log('Bill A Title:', overview?.bill_a_title);
        console.log('Bill B Title:', overview?.bill_b_title);
        console.log('Scope:', overview?.scope);
        console.log('Urgency:', overview?.urgency);
        
        const keyTopics = summary.executive_summary.key_debate_topics;
        if (keyTopics && keyTopics.length > 0) {
          console.log('\n--- Key Debate Topics ---');
          keyTopics.slice(0, 3).forEach((topic, i) => {
            console.log(`${i + 1}. ${topic.topic} (${topic.priority})`);
            console.log(`   ${topic.description}`);
          });
        }
        
        const changes = summary.executive_summary.biggest_changes;
        if (changes && changes.length > 0) {
          console.log('\n--- Biggest Changes ---');
          changes.slice(0, 3).forEach((change, i) => {
            console.log(`${i + 1}. ${change.change_title}`);
            console.log(`   ${change.impact_summary}`);
          });
        }
      } else {
        console.log('Executive summary not found in expected structure.');
        console.log('Available keys:', Object.keys(summary));
        
        // Check for errors
        if (summary.error) {
          console.error('Error in executive summary:', summary.error);
          console.error('Raw response:', summary.rawResponse?.substring(0, 500));
        }
      }
      
      if (result.debug) {
        console.log('\n=== DEBUG INFO ===');
        console.log('Text extraction lengths:', result.debug.billA_length, result.debug.billB_length);
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

testPDFFiles();
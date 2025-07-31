const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Demo test using the local demo documents
async function testDemoDocuments() {
  try {
    const originalPath = 'test/demo_bill_original.txt';
    const revisedPath = 'test/demo_bill_revised.txt';
    
    // Check if demo files exist
    if (!fs.existsSync(originalPath) || !fs.existsSync(revisedPath)) {
      console.error('Demo files not found. Make sure demo_bill_original.txt and demo_bill_revised.txt exist in test/ directory');
      return;
    }
    
    // Create a new FormData instance
    const formData = new FormData();
    
    // Append demo files from the filesystem
    formData.append('billA_file', fs.createReadStream(originalPath), path.basename(originalPath));
    formData.append('billB_file', fs.createReadStream(revisedPath), path.basename(revisedPath));
    
    console.log('🚀 Testing with Education Equity Act demo documents...');
    console.log(`📄 Original: ${originalPath} (${fs.statSync(originalPath).size} bytes)`);
    console.log(`📄 Revised:  ${revisedPath} (${fs.statSync(revisedPath).size} bytes)`);
    console.log('');
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/compare', {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders()
      },
    });
    
    const endTime = Date.now();
    console.log(`⏱️  Request completed in ${(endTime - startTime) / 1000}s`);
    console.log('');
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ DEMO ANALYSIS SUCCESSFUL');
      console.log('==========================================');
      
      // Display the analysis results
      const summary = result.executive_summary;
      
      if (summary && summary.executive_summary) {
        const overview = summary.executive_summary.document_overview;
        console.log('📋 DOCUMENT OVERVIEW:');
        console.log(`   Subject: ${overview?.primary_subject}`);
        console.log(`   Original: ${overview?.bill_a_title}`);
        console.log(`   Revised:  ${overview?.bill_b_title}`);
        console.log(`   Scope: ${overview?.scope}`);
        console.log(`   Urgency: ${overview?.urgency}`);
        console.log('');
        
        const keyTopics = summary.executive_summary.key_debate_topics;
        if (keyTopics && keyTopics.length > 0) {
          console.log('🔥 KEY DEBATE TOPICS:');
          keyTopics.slice(0, 3).forEach((topic, i) => {
            console.log(`   ${i + 1}. ${topic.topic} (${topic.priority})`);
            console.log(`      ${topic.description}`);
          });
          console.log('');
        }
        
        const changes = summary.executive_summary.biggest_changes;
        if (changes && changes.length > 0) {
          console.log('📈 BIGGEST CHANGES:');
          changes.slice(0, 3).forEach((change, i) => {
            console.log(`   ${i + 1}. ${change.change_title}`);
            console.log(`      ${change.impact_summary}`);
          });
          console.log('');
        }
        
        const stakeholders = summary.executive_summary.stakeholder_impacts;
        if (stakeholders && stakeholders.length > 0) {
          console.log('👥 STAKEHOLDER IMPACTS:');
          stakeholders.slice(0, 3).forEach((stakeholder, i) => {
            console.log(`   ${i + 1}. ${stakeholder.stakeholder_group}: ${stakeholder.impact_level}`);
            console.log(`      ${stakeholder.impact_description}`);
          });
        }
      } else {
        console.log('❌ Executive summary not found in expected structure.');
        console.log('Available keys:', Object.keys(result));
        
        // Check for errors
        if (result.error) {
          console.error('🚨 Error in analysis:', result.error);
          if (result.technical_details) {
            console.log('🔧 Technical Details:');
            console.log('   Issue:', result.technical_details.issue);
            console.log('   Solutions:', result.technical_details.solutions);
          }
        }
      }
      
      if (result.debug) {
        console.log('');
        console.log('🔍 DEBUG INFO:');
        console.log(`   Text lengths: ${result.debug.billA_length} vs ${result.debug.billB_length} characters`);
        console.log(`   Original preview: ${result.debug.billA_preview}`);
        console.log(`   Revised preview: ${result.debug.billB_preview}`);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status);
      
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Error details:', errorJson.error);
        if (errorJson.technical_details) {
          console.log('🔧 Technical Details:');
          console.log('   Issue:', errorJson.technical_details.issue);
          console.log('   Solutions:');
          errorJson.technical_details.solutions.forEach((solution, i) => {
            console.log(`   ${i + 1}. ${solution}`);
          });
        }
      } catch (parseError) {
        console.error('Raw error response:', errorText.substring(0, 500));
      }
    }
  } catch (error) {
    console.error('🚨 Test error:', error.message);
  }
}

// Run the demo
console.log('🎯 Education Equity Act Demo Analysis');
console.log('=====================================');
testDemoDocuments();
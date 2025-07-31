// Simple demo test for the Education Equity Act analysis
async function testDemo() {
  try {
    console.log('🎯 Testing Demo Mode - Education Equity Act Analysis');
    console.log('='.repeat(60));
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:3000/api/compare');
    const endTime = Date.now();
    
    if (response.ok) {
      const result = await response.json();
      
      console.log(`✅ Demo completed in ${(endTime - startTime) / 1000}s`);
      console.log('');
      
      if (result.demo_mode) {
        console.log('📋 DEMO ANALYSIS RESULTS');
        console.log('━'.repeat(40));
        console.log(`📄 Original: ${result.demo_documents.original}`);
        console.log(`📄 Revised:  ${result.demo_documents.revised}`);
        console.log('');
        
        const summary = result.executive_summary?.executive_summary;
        if (summary) {
          const overview = summary.document_overview;
          console.log('🏛️  DOCUMENT OVERVIEW');
          console.log(`   Subject: ${overview.primary_subject}`);
          console.log(`   Scope: ${overview.scope}`);
          console.log(`   Urgency: ${overview.urgency}`);
          console.log('');
          
          if (summary.key_debate_topics?.length > 0) {
            console.log('🔥 KEY DEBATE TOPICS');
            summary.key_debate_topics.forEach((topic, i) => {
              console.log(`   ${i + 1}. ${topic.topic} (${topic.priority} priority)`);
              console.log(`      ${topic.description}`);
              console.log('');
            });
          }
          
          if (summary.biggest_changes?.length > 0) {
            console.log('📈 BIGGEST CHANGES');
            summary.biggest_changes.forEach((change, i) => {
              console.log(`   ${i + 1}. ${change.change_title}`);
              console.log(`      Impact: ${change.impact_summary}`);
              if (change.dollar_impact) {
                console.log(`      Financial: ${change.dollar_impact}`);
              }
              console.log('');
            });
          }
          
          if (summary.citizen_impact_summary) {
            console.log('👥 CITIZEN IMPACT');
            console.log(`   ${summary.citizen_impact_summary}`);
            console.log('');
          }
          
          console.log('📊 DOCUMENT STATS');
          console.log(`   Original text: ${result.debug.billA_length} characters`);
          console.log(`   Revised text:  ${result.debug.billB_length} characters`);
          console.log(`   Increase: +${result.debug.billB_length - result.debug.billA_length} characters`);
        }
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Demo failed:', response.status);
      console.error(errorText.substring(0, 300));
    }
  } catch (error) {
    console.error('🚨 Error running demo:', error.message);
  }
}

// Run the demo
testDemo();
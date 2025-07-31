const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_MSG = `You are a legislative analysis model. Return valid JSON matching the requested schema.`;

const NORMALIZE_PROMPT = `
Extract a hierarchical outline of the bill with stable IDs and precise line references for citation.

Return JSON:
{
  "bill_id": "A",
  "sections": [
    {
      "section_id": "S<number or title>",
      "title": "string",
      "line_start": 1,
      "line_end": 10,
      "text": "verbatim text of this section",
      "key_phrases": ["important phrase 1", "important phrase 2"]
    }
  ]
}

Rules:
- Preserve original order and exact text.
- Generate section_id from headings; if none, synthesize S1, S2…
- line_* are 1-based indices relative to the provided text split by newline.
- Include key_phrases that contain important policy terms, dollar amounts, dates, or scope definitions.
- Maintain exact quotes for citation purposes.
- Return JSON only.

--- BILL A START ---
EDUCATION EQUITY AND ACCESS ACT

SECTION 1. SHORT TITLE.
This Act may be cited as the "Education Equity and Access Act".

SECTION 2. FINDINGS AND PURPOSE.
(a) FINDINGS.—Congress finds that—
(1) educational disparities persist across socioeconomic and geographic lines;
(2) rural and urban Title I schools lack adequate resources for effective education;
(3) digital access gaps limit student opportunities in grades 6-12.

SECTION 3. FUNDING AUTHORIZATION.
(a) IN GENERAL.—There is authorized to be appropriated $1,500,000,000 annually for each of fiscal years 2024 through 2028 to carry out this Act.
(b) ALLOCATION.—Funds shall be allocated to Title I schools based on student enrollment and need assessment.

SECTION 4. DIGITAL ACCESS PROGRAM.
(a) ESTABLISHMENT.—The Secretary shall establish a digital access program to provide technology resources to students in grades 6 through 12.
(b) ELIGIBLE STUDENTS.—Students in Title I schools shall be eligible for laptops and internet access under this program.

SECTION 5. TEACHER SUPPORT.
(a) PROFESSIONAL DEVELOPMENT.—The Secretary shall provide professional development programs for teachers in participating schools.
(b) TRAINING REQUIREMENTS.—Teachers must complete 40 hours of annual training to maintain program eligibility.
--- BILL A END ---
`;

async function testLLM() {
  try {
    console.log('Testing OpenAI API with education document...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_MSG },
        { role: "user", content: NORMALIZE_PROMPT }
      ],
    });

    const content = response.choices[0].message.content;
    console.log('Raw LLM response:');
    console.log(content);
    
    const parsed = JSON.parse(content);
    console.log('\nParsed sections:', parsed.sections?.length || 0);
    
    if (parsed.sections && parsed.sections.length > 0) {
      console.log('First section:', parsed.sections[0]);
    }
    
  } catch (error) {
    console.error('LLM test error:', error);
  }
}

testLLM();
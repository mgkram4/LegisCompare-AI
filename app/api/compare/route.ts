import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// System message for GPT
const SYSTEM_MSG = `You are a legislative analysis model. Always return valid UTF-8 JSON matching the requested schema. Cite evidence by section_id and line_range from the input. If unsure, set confidence='low' and explain. Never invent sections that don't exist in the input.`;

// Helper function to call GPT and get JSON response
async function llmJson(system: string, prompt: string, temperature: number = 0.2): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from OpenAI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`OpenAI API error: ${error}`);
  }
}

// Prompt templates
const NORMALIZE_PROMPT = `
Extract a hierarchical outline of the bill with stable IDs.

Return JSON:
{
  "bill_id": "%(bill_id)s",
  "sections": [
    {
      "section_id": "S<number or title>",
      "title": "string",
      "line_start": 1,
      "line_end": 10,
      "text": "verbatim text of this section"
    }
  ]
}

Rules:
- Preserve original order.
- Generate section_id from headings; if none, synthesize S1, S2…
- line_* are 1-based indices relative to the provided text split by newline.
- Return JSON only.

--- BILL %(bill_id)s START ---
%(bill_text)s
--- BILL %(bill_id)s END ---
`;

const ALIGN_PROMPT = `
Given two structured bills, align semantically similar sections.

Input JSON:
{
  "billA": %(billA_json)s,
  "billB": %(billB_json)s
}

Return JSON:
{
  "pairs": [
    {
      "a_section_id": "string|null",
      "b_section_id": "string|null",
      "similarity": 0.85,
      "rationale": "one sentence"
    }
  ]
}

Rules:
- Unpaired additions/removals use null on the other side.
- Keep only pairs with similarity >= 0.35, else leave unpaired.
- JSON only.
`;

const DIFF_PROMPT = `
Produce a git-style diff by aligned pairs plus orphaned sections.

Input JSON:
{
  "billA": %(billA_json)s,
  "billB": %(billB_json)s,
  "pairs": %(pairs_json)s
}

Return JSON:
{
  "changes": [
    {
      "id": "chg_001",
      "change_type": "addition|removal|modification",
      "a_section_id": "string|null",
      "b_section_id": "string|null",
      "a_text": "string|null",
      "b_text": "string|null",
      "diff_preview": "git-like snippet, max 240 chars",
      "impact": {
        "legal": "one sentence",
        "social": "one sentence",
        "economic": "one sentence"
      },
      "evidence": [
        {"bill_id": "A|B", "section_id": "string", "line_range": "Lstart-Lend"}
      ],
      "confidence": "low|medium|high",
      "notes": "optional assumptions"
    }
  ]
}

Rules:
- For modifications, include the most changed sentences in diff_preview.
- Evidence must reference real section_id + line_range from inputs.
- JSON only.
`;

const STAKEHOLDER_PROMPT = `
Identify stakeholders and link them to specific change IDs.

Input JSON:
{
  "changes": %(changes_json)s
}

Return JSON:
{
  "stakeholders": [
    {
      "name": "e.g., Independent contractors, State Medicaid agencies",
      "category": "industry|demographic|institution|ngo|other",
      "effect": "benefit|harm|mixed",
      "mechanism": "how the change affects them",
      "magnitude": "low|medium|high",
      "time_horizon": "short|medium|long",
      "linked_changes": ["chg_001","chg_002"],
      "confidence": "low|medium|high"
    }
  ]
}

Rules:
- Prefer referencing specific change IDs to justify claims.
- JSON only.
`;

const BIAS_PROMPT = `
Analyze the provided legislative text for potential biases or disproportionate impacts on specific groups.

Input JSON:
{
  "bill_text": "%(bill_text)s"
}

Return JSON:
{
  "bias_analysis": [
    {
      "type": "demographic|socioeconomic|geographic|other",
      "description": "one sentence description of the potential bias",
      "impacted_groups": ["group1", "group2"],
      "evidence": [
        {"bill_id": "A", "section_id": "string", "line_range": "Lstart-Lend"}
      ],
      "confidence": "low|medium|high"
    }
  ]
}

Rules:
- Be specific about the type of bias and the impacted groups.
- Cite evidence from the original text where possible.
- JSON only.
`;

const FORECAST_PROMPT = `
Forecast outcomes if Bill B (compared to Bill A) is enacted.

Input JSON:
{
  "changes": %(changes_json)s,
  "stakeholders": %(stakeholders_json)s
}

Return JSON:
{
  "assumptions": ["bullet assumptions"],
  "risks": ["key legal/political risks"],
  "forecasts": {
    "short_1y": [
      {
        "domain": "economic|social|political|legal|operational",
        "impact": "concise statement",
        "direction": "increase|decrease|mixed|unknown",
        "magnitude": "low|medium|high",
        "who": ["stakeholder names"],
        "linked_changes": ["chg_..."],
        "metrics_to_track": ["KPI1","KPI2"],
        "confidence": "low|medium|high"
      }
    ],
    "medium_3y": [],
    "long_5y": []
  }
}

Rules:
- Tie each forecast to concrete changes and stakeholders.
- Include measurable KPIs where possible.
- JSON only.
`;

const CRITIQUE_PROMPT = `
Review the JSON below for overclaims, missing evidence, or non-JSON parts.

Input:
%(combined_json)s

Return JSON:
{
  "issues": [
    {"path": "changes[3].impact.economic", "problem": "no evidence citation"}
  ],
  "ok": true
}
`;

// Helper functions for analysis steps
function formatPrompt(template: string, variables: Record<string, any>): string {
  let formatted = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `%(${key})s`;
    formatted = formatted.replace(new RegExp(placeholder, 'g'), String(value));
  }
  return formatted;
}

async function normalizeBill(billId: string, text: string) {
  const prompt = formatPrompt(NORMALIZE_PROMPT, { bill_id: billId, bill_text: text });
  return llmJson(SYSTEM_MSG, prompt, 0.2);
}

async function alignSections(billAJson: any, billBJson: any) {
  const prompt = formatPrompt(ALIGN_PROMPT, {
    billA_json: JSON.stringify(billAJson),
    billB_json: JSON.stringify(billBJson),
  });
  return llmJson(SYSTEM_MSG, prompt, 0.2);
}

async function makeDiff(billAJson: any, billBJson: any, pairsJson: any) {
  const prompt = formatPrompt(DIFF_PROMPT, {
    billA_json: JSON.stringify(billAJson),
    billB_json: JSON.stringify(billBJson),
    pairs_json: JSON.stringify(pairsJson),
  });
  const result = await llmJson(SYSTEM_MSG, prompt, 0.2);
  
  // Ensure IDs exist
  if (result.changes) {
    result.changes.forEach((change: any, index: number) => {
      if (!change.id) {
        change.id = `chg_${String(index + 1).padStart(3, '0')}`;
      }
    });
  }
  
  return result;
}

async function analyzeStakeholders(changesJson: any) {
  const prompt = formatPrompt(STAKEHOLDER_PROMPT, {
    changes_json: JSON.stringify(changesJson)
  });
  return llmJson(SYSTEM_MSG, prompt, 0.2);
}

async function analyzeBias(billText: string) {
  const prompt = formatPrompt(BIAS_PROMPT, { bill_text: billText });
  return llmJson(SYSTEM_MSG, prompt, 0.2);
}

async function forecastImpacts(changesJson: any, stakeholdersJson: any) {
  const prompt = formatPrompt(FORECAST_PROMPT, {
    changes_json: JSON.stringify(changesJson),
    stakeholders_json: JSON.stringify(stakeholdersJson),
  });
  return llmJson(SYSTEM_MSG, prompt, 0.2);
}

async function critiqueAll(payload: any) {
  const prompt = formatPrompt(CRITIQUE_PROMPT, {
    combined_json: JSON.stringify(payload)
  });
  return llmJson(SYSTEM_MSG, prompt, 0.2);
}

// Helper function to extract text from uploaded files
async function extractTextFromFile(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    // For PDF files, use pdf-parse
    const pdfParse = (await import('pdf-parse')).default;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    return pdfData.text;
  } else {
    // For text files
    return file.text();
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    
    // Get bill content from form data
    let billAText = formData.get('billA_text') as string;
    let billBText = formData.get('billB_text') as string;
    const billAFile = formData.get('billA_file') as File;
    const billBFile = formData.get('billB_file') as File;
    const demo = formData.get('demo') === 'true';

    // Handle demo mode
    if (demo && !billAText && !billBText) {
      billAText = "SECTION 1. Establishes a $50 fee. SECTION 2. Creates a small grant program.";
      billBText = "SECTION 1. Establishes a $75 fee. SECTION 2. Creates a grant program with eligibility for nonprofits.";
    }

    // Extract text from files if not provided as text
    if (!billAText && billAFile) {
      billAText = await extractTextFromFile(billAFile);
    }
    if (!billBText && billBFile) {
      billBText = await extractTextFromFile(billBFile);
    }

    if (!billAText || !billBText) {
      return NextResponse.json(
        { error: 'Provide Bill A and Bill B as text or files.' },
        { status: 400 }
      );
    }

    // Perform analysis steps
    console.log('1. Normalizing bills...');
    const normalizedA = await normalizeBill("A", billAText);
    const normalizedB = await normalizeBill("B", billBText);

    console.log('2. Aligning sections...');
    const pairs = await alignSections(normalizedA, normalizedB);

    console.log('3. Creating diff...');
    const changes = await makeDiff(normalizedA, normalizedB, pairs);

    console.log('4. Analyzing stakeholders...');
    const stakeholders = await analyzeStakeholders(changes);

    console.log('5. Forecasting impacts...');
    const forecast = await forecastImpacts(changes, stakeholders);

    console.log('6. Analyzing bias...');
    const biasAnalysis = await analyzeBias(billAText);

    console.log('7. Critiquing results...');
    const combo = {
      normalizedA,
      normalizedB,
      pairs,
      changes,
      stakeholders,
      forecast,
      bias_analysis: biasAnalysis,
    };
    const critique = await critiqueAll(combo);

    // Return the complete analysis
    return NextResponse.json({
      normalizedA,
      normalizedB,
      pairs,
      changes,
      stakeholders,
      forecast,
      critique,
      bias_analysis: biasAnalysis,
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: `Analysis failed: ${error}` },
      { status: 500 }
    );
  }
}

import io
import json
import os
import re
from typing import Any, Dict, List, Optional, Union

from dotenv import load_dotenv  # Import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
from starlette.responses import JSONResponse

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env')) # Load environment variables from .env file

# ---- OpenAI client (supports both new and legacy SDKs) -----------------------
USE_OPENAI = bool(os.getenv("OPENAI_API_KEY"))
print(f"DEBUG: OPENAI_API_KEY is set: {bool(os.getenv("OPENAI_API_KEY"))}") # Debug print
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
import httpx  # Import httpx


def _openai_client():
    if not USE_OPENAI:
        return None
    try:
        # New SDK (1.0.0+)
        # Create OpenAI client with httpx configuration
        import httpx
        from openai import OpenAI
        http_client = httpx.Client(proxies={})
        client = OpenAI(http_client=http_client)
        return ("new", client)
    except ImportError:
        # Legacy SDK fallback (< 1.0.0)
        try:
            import openai
            return ("legacy", openai)
        except ImportError:
            raise ImportError("OpenAI library not installed. Run: pip install openai")

def llm_json(system: str, prompt: str, temperature: float = 0.2) -> Dict[str, Any]:
    """
    Call the LLM and return parsed JSON. If OPENAI_API_KEY is not set,
    return a simple heuristic/dummy structure for local dev.
    """
    if not USE_OPENAI:
        # Minimal offline fallback so the app doesn't crash during dev.
        try:
            data = json.loads(prompt[prompt.find("{"):prompt.rfind("}")+1])
        except Exception:
            data = {}
        return {"offline_stub": True, "input_hint": list(data.keys())}
    
    mode, client = _openai_client()
    
    if mode == "new":
        # New SDK (1.0.0+)
        try:
            resp = client.chat.completions.create(
                model=OPENAI_MODEL,
                temperature=temperature,
                response_format={"type": "json_object"},  # This ensures JSON response
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ],
            )
            content = resp.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    else:
        # Legacy SDK (< 1.0.0)
        try:
            resp = client.ChatCompletion.create(
                model=OPENAI_MODEL,
                temperature=temperature,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
            )
            content = resp.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
    
    try:
        return json.loads(content)
    except Exception:
        raise HTTPException(status_code=500, detail=f"LLM did not return valid JSON:\n{content[:500]}")

# ---- Prompts -----------------------------------------------------------------
SYSTEM_MSG = (
    "You are a legislative analysis model. Always return valid UTF-8 JSON "
    "matching the requested schema. Cite evidence by section_id and line_range "
    "from the input. If unsure, set confidence='low' and explain. "
    "Never invent sections that don't exist in the input."
)

NORMALIZE_PROMPT = """
Extract a hierarchical outline of the bill with stable IDs.

Return JSON:
{
  "bill_id": "%(bill_id)s",
  "sections": [
    {
      "section_id": "S<number or title>",
      "title": "string",
      "line_start": int,
      "line_end": int,
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
"""

ALIGN_PROMPT = """
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
      "similarity": 0.0,
      "rationale": "one sentence"
    }
  ]
}

Rules:
- Unpaired additions/removals use null on the other side.
- Keep only pairs with similarity >= 0.35, else leave unpaired.
- JSON only.
"""

DIFF_PROMPT = """
Produce a git-style diff by aligned pairs plus orphaned sections.

Input JSON:
{
  "billA": %(billA_json)s,
  "billB": %(billB_json)s,
  "pairs": %(pairs_json)s
}

Return JSON (not text blocks):
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
"""

STAKEHOLDER_PROMPT = """
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
"""

BIAS_PROMPT = """
Analyze the provided legislative text for potential biases or disproportionate impacts on specific groups.
Consider potential biases related to demographics, socioeconomic status, geographic location, or any other relevant factors.

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
"""

FORECAST_PROMPT = """
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
"""

CRITIQUE_PROMPT = """
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
"""

# ---- Schemas -----------------------------------------------------------------
class CompareRequest(BaseModel):
    billA_text: Optional[str] = None
    billB_text: Optional[str] = None

class CompareResponse(BaseModel):
    normalizedA: Dict[str, Any]
    normalizedB: Dict[str, Any]
    pairs: Dict[str, Any]
    changes: Dict[str, Any]
    stakeholders: Dict[str, Any]
    forecast: Dict[str, Any]
    critique: Dict[str, Any]
    bias_analysis: Dict[str, Any] # Added bias analysis field

# ---- Helpers -----------------------------------------------------------------
def read_upload(file: Optional[UploadFile]) -> Optional[str]:
    if not file:
        return None
    
    # Read the file content once
    raw_content = file.file.read()
    
    if file.content_type == 'application/pdf':
        try:
            pdf_reader = PdfReader(io.BytesIO(raw_content))
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text
            if not text.strip():
                raise ValueError("No text could be extracted from PDF.")
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process PDF file: {e}")
    else:
        # Assume text file
        try:
            return raw_content.decode("utf-8")
        except UnicodeDecodeError:
            # best effort for other text-like files
            return raw_content.decode("latin-1", errors="ignore")

def normalize_bill(bill_id: str, text: str) -> Dict[str, Any]:
    prompt = NORMALIZE_PROMPT % {"bill_id": bill_id, "bill_text": text}
    return llm_json(SYSTEM_MSG, prompt, temperature=0.2)

def align_sections(billA_json: Dict[str, Any], billB_json: Dict[str, Any]) -> Dict[str, Any]:
    prompt = ALIGN_PROMPT % {
        "billA_json": json.dumps(billA_json, ensure_ascii=False),
        "billB_json": json.dumps(billB_json, ensure_ascii=False),
    }
    return llm_json(SYSTEM_MSG, prompt, temperature=0.2)

def make_diff(billA_json: Dict[str, Any], billB_json: Dict[str, Any], pairs_json: Dict[str, Any]) -> Dict[str, Any]:
    prompt = DIFF_PROMPT % {
        "billA_json": json.dumps(billA_json, ensure_ascii=False),
        "billB_json": json.dumps(billB_json, ensure_ascii=False),
        "pairs_json": json.dumps(pairs_json, ensure_ascii=False),
    }
    out = llm_json(SYSTEM_MSG, prompt, temperature=0.2)
    # Ensure IDs exist
    if "changes" in out:
        for i, ch in enumerate(out["changes"]):
            ch.setdefault("id", f"chg_{i+1:03d}")
    return out

def analyze_stakeholders(changes_json: Dict[str, Any]) -> Dict[str, Any]:
    prompt = STAKEHOLDER_PROMPT % {
        "changes_json": json.dumps(changes_json, ensure_ascii=False)
    }
    return llm_json(SYSTEM_MSG, prompt, temperature=0.2)

def analyze_bias(bill_text: str) -> Dict[str, Any]: # New helper function for bias analysis
    prompt = BIAS_PROMPT % {
        "bill_text": bill_text
    }
    return llm_json(SYSTEM_MSG, prompt, temperature=0.2)

def forecast_impacts(changes_json: Dict[str, Any], stakeholders_json: Dict[str, Any]) -> Dict[str, Any]:
    prompt = FORECAST_PROMPT % {
        "changes_json": json.dumps(changes_json, ensure_ascii=False),
        "stakeholders_json": json.dumps(stakeholders_json, ensure_ascii=False),
    }
    return llm_json(SYSTEM_MSG, prompt, temperature=0.2)

def critique_all(payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = CRITIQUE_PROMPT % {
        "combined_json": json.dumps(payload, ensure_ascii=False)
    }
    return llm_json(SYSTEM_MSG, prompt, temperature=0.2)

# ---- FastAPI -----------------------------------------------------------------
app = FastAPI(title="LegisDiff API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/compare", response_model=CompareResponse)
async def compare_route(
    billA_text: Optional[str] = Form(None),
    billB_text: Optional[str] = Form(None),
    billA_file: Optional[UploadFile] = File(None),
    billB_file: Optional[UploadFile] = File(None),
    demo: Optional[bool] = Form(False),
):
    """Accepts either raw text via form fields or file uploads. Returns structured JSON."""
    # Demo seeds (tiny text so you can test without keys)
    if demo and not billA_text and not billB_text:
        billA_text = "SECTION 1. Establishes a $50 fee. SECTION 2. Creates a small grant program."
        billB_text = "SECTION 1. Establishes a $75 fee. SECTION 2. Creates a grant program with eligibility for nonprofits."

    if not billA_text:
        billA_text = read_upload(billA_file)
    if not billB_text:
        billB_text = read_upload(billB_file)

    if not billA_text or not billB_text:
        raise HTTPException(status_code=400, detail="Provide Bill A and Bill B as text or files.")

    # 1) Normalize
    normalizedA = normalize_bill("A", billA_text)
    normalizedB = normalize_bill("B", billB_text)

    # 2) Align
    pairs = align_sections(normalizedA, normalizedB)

    # 3) Diff
    changes = make_diff(normalizedA, normalizedB, pairs)

    # 4) Stakeholders
    stakeholders = analyze_stakeholders(changes)

    # 5) Forecast
    forecast = forecast_impacts(changes, stakeholders)

    # 6) Bias Analysis (new step)
    bias_analysis = analyze_bias(billA_text) # Using billA_text for bias analysis, assuming it's the primary document

    # 7) Critique
    combo = {
        "normalizedA": normalizedA,
        "normalizedB": normalizedB,
        "pairs": pairs,
        "changes": changes,
        "stakeholders": stakeholders,
        "forecast": forecast,
        "bias_analysis": bias_analysis, # Added bias analysis to combo
    }
    critique = critique_all(combo)

    return JSONResponse(
        content={
            "normalizedA": normalizedA,
            "normalizedB": normalizedB,
            "pairs": pairs,
            "changes": changes,
            "stakeholders": stakeholders,
            "forecast": forecast,
            "critique": critique,
            "bias_analysis": bias_analysis, # Added bias analysis to response
        }
    )

@app.get("/healthz")
def healthz():
    return {"ok": True, "openai": USE_OPENAI, "model": OPENAI_MODEL} 
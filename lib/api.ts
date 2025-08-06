
// API configuration for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mixed-stove-production.up.railway.app';

export interface ComparisonResponse {
  executive_summary: {
    bill_a_title: string;
    bill_b_title: string;
    primary_subject: string;
    key_changes: Array<{
      topic: string;
      description: string;
      impact: string;
      original_quote: string;
      proposed_quote: string;
    }>;
    overall_impact_assessment: string;
  };
  stakeholder_analysis: Array<{
    name: string;
    category: string;
    effect: string;
    description: string;
    evidence_quote: string;
  }>;
  impact_forecast: {
    assumptions: string[];
    short_term_1y: {
      economic: string;
      social: string;
      political: string;
    };
    medium_term_3y: {
      economic: string;
      social: string;
      political: string;
    };
    long_term_5y: {
      economic: string;
      social: string;
      political: string;
    };
  };
  metadata: {
    bill_a_name: string;
    bill_b_name: string;
    processed_at: string;
  };
}

export interface TestPDFResponse {
  success: boolean;
  filename: string;
  fileSize: number;
  textLength: number;
  processingTimeMs: number;
  preview: string;
  fullText: string;
}

export async function compareDocuments(billAFile: File, billBFile: File): Promise<ComparisonResponse> {
  const formData = new FormData();
  formData.append('bill_a_file', billAFile);
  formData.append('bill_b_file', billBFile);

  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function testPDFExtraction(file: File): Promise<TestPDFResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/test-pdf`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function checkBackendHealth(): Promise<{ ok: boolean; openai: boolean; model: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error(`Backend health check failed: ${response.status}`);
  }
  
  return response.json();
} 
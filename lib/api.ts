
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

interface AnalysisResult {
  diff: string;
  summary: string;
  stakeholders: string;
  bias: string;
  forecast: string;
}

export async function compareBills(billA: string, billB: string): Promise<AnalysisResult> {
  try {
    const response = await axios.post<AnalysisResult>(`${API_BASE_URL}/compare`, {
      bill_a: billA,
      bill_b: billB,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'Failed to compare bills.');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred.');
    }
  }
} 
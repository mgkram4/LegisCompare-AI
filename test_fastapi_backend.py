#!/usr/bin/env python3
"""
Test script for FastAPI backend
"""
import requests
import os
import sys
from pathlib import Path

def test_backend_health(base_url="http://localhost:8000"):
    """Test backend health endpoint"""
    try:
        print("Testing backend health...")
        response = requests.get(f"{base_url}/health")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is healthy")
            print(f"   OpenAI configured: {data.get('openai', False)}")
            print(f"   Model: {data.get('model', 'Unknown')}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Is it running?")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_pdf_extraction(pdf_path, base_url="http://localhost:8000"):
    """Test PDF extraction endpoint"""
    try:
        print(f"\nTesting PDF extraction for: {pdf_path}")
        
        if not os.path.exists(pdf_path):
            print(f"❌ File not found: {pdf_path}")
            return False
        
        with open(pdf_path, 'rb') as f:
            files = {'file': (os.path.basename(pdf_path), f, 'application/pdf')}
            response = requests.post(f"{base_url}/api/test-pdf", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ PDF extraction successful")
            print(f"   Filename: {data.get('filename')}")
            print(f"   File size: {data.get('fileSize')} bytes")
            print(f"   Text length: {data.get('textLength')} characters")
            print(f"   Processing time: {data.get('processingTimeMs')}ms")
            print(f"   Preview: {data.get('preview', '')[:100]}...")
            return True
        else:
            print(f"❌ PDF extraction failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ PDF extraction error: {e}")
        return False

def test_document_comparison(pdf1_path, pdf2_path, base_url="http://localhost:8000"):
    """Test document comparison endpoint"""
    try:
        print(f"\nTesting document comparison:")
        print(f"   Document 1: {pdf1_path}")
        print(f"   Document 2: {pdf2_path}")
        
        if not os.path.exists(pdf1_path) or not os.path.exists(pdf2_path):
            print("❌ One or both files not found")
            return False
        
        with open(pdf1_path, 'rb') as f1, open(pdf2_path, 'rb') as f2:
            files = {
                'bill_a_file': (os.path.basename(pdf1_path), f1, 'application/pdf'),
                'bill_b_file': (os.path.basename(pdf2_path), f2, 'application/pdf')
            }
            response = requests.post(f"{base_url}/api/compare", files=files)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Document comparison successful")
            print(f"   Executive summary: {len(data.get('executive_summary', {}))} fields")
            print(f"   Stakeholder analysis: {len(data.get('stakeholder_analysis', []))} stakeholders")
            print(f"   Impact forecast: {len(data.get('impact_forecast', {}))} timeframes")
            return True
        else:
            print(f"❌ Document comparison failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Document comparison error: {e}")
        return False

def main():
    """Run all tests"""
    print("=== FastAPI Backend Test Suite ===\n")
    
    base_url = "http://localhost:8000"
    
    # Test 1: Health check
    if not test_backend_health(base_url):
        print("\n❌ Backend health check failed. Please start the backend first.")
        print("Run: cd backend && python start.py")
        sys.exit(1)
    
    # Test 2: PDF extraction with sample files
    test_files = [
        "FWPA_Draft.pdf",
        "test/hr1_enrolled.pdf", 
        "test/hr748_enrolled.pdf"
    ]
    
    pdf_extraction_success = False
    for pdf_file in test_files:
        if os.path.exists(pdf_file):
            if test_pdf_extraction(pdf_file, base_url):
                pdf_extraction_success = True
                break
    
    if not pdf_extraction_success:
        print("\n❌ No PDF files found for testing")
        print("Please ensure you have PDF files in the project directory")
    
    # Test 3: Document comparison (if we have at least 2 PDFs)
    available_pdfs = [f for f in test_files if os.path.exists(f)]
    if len(available_pdfs) >= 2:
        test_document_comparison(available_pdfs[0], available_pdfs[1], base_url)
    else:
        print("\n⚠️  Need at least 2 PDF files to test document comparison")
    
    print("\n=== Test Suite Complete ===")
    print("\nTo start the backend:")
    print("cd backend && python start.py")
    print("\nTo view API documentation:")
    print("http://localhost:8000/docs")

if __name__ == "__main__":
    main() 
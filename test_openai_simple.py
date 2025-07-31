#!/usr/bin/env python3
"""
Simple OpenAI test
"""
import os

import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

# Configure OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def test_openai():
    """Test OpenAI API"""
    try:
        print("Testing OpenAI API...")
        print(f"API Key: {'Set' if OPENAI_API_KEY else 'Not set'}")
        print(f"Model: {OPENAI_MODEL}")
        
        # Create client
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        # Simple test
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "user", "content": "Say hello"}
            ],
            max_tokens=10
        )
        
        content = response.choices[0].message.content
        print(f"✅ Success! Response: {content}")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    test_openai() 
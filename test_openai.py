#!/usr/bin/env python3
"""
Test OpenAI API connectivity
"""
import os

import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

# Configure OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

def test_openai_connection():
    """Test basic OpenAI API connectivity"""
    try:
        print("Testing OpenAI API connection...")
        print(f"API Key configured: {'Yes' if OPENAI_API_KEY else 'No'}")
        print(f"Model: {OPENAI_MODEL}")
        
        # Simple test call
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=[
                {"role": "user", "content": "Say 'Hello, OpenAI is working!'"}
            ],
            max_tokens=50
        )
        
        content = response.choices[0].message.content
        print(f"✅ OpenAI API test successful!")
        print(f"Response: {content}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API test failed: {e}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    test_openai_connection() 
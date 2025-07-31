#!/usr/bin/env python3
"""
Minimal OpenAI test
"""
import openai


def test_openai_minimal():
    """Test OpenAI API with minimal setup"""
    try:
        print("Testing OpenAI API with minimal setup...")
        
        # Create client with API key from environment variable
        import os
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("❌ Error: OPENAI_API_KEY environment variable not set")
            return False
        
        client = openai.OpenAI(api_key=api_key)
        
        # Simple test
        response = client.chat.completions.create(
            model="gpt-4o-mini",
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
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    test_openai_minimal() 
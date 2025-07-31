#!/usr/bin/env python3
"""
Startup script for the FastAPI backend
"""
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Get port from environment or default to 8000
    port = int(os.getenv("BACKEND_PORT", 8000))
    
    print(f"Starting Document Comparison API on port {port}")
    print("API will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    ) 
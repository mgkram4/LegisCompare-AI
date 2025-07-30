#!/usr/bin/env python3

import sys
import traceback

import uvicorn
from main import app


def main():
    try:
        print("Starting server...")
        print(f"Python version: {sys.version}")
        print(f"Uvicorn version: {uvicorn.__version__}")
        
        config = uvicorn.Config(
            app=app,
            host="127.0.0.1",
            port=8000,
            log_level="info",
            reload=True
        )
        server = uvicorn.Server(config)
        print("Server configured, starting...")
        server.run()
        
    except Exception as e:
        print(f"Error starting server: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main() 
#!/usr/bin/env python3
"""
Setup script for FastAPI backend
"""
import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description, cwd=None):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True, cwd=cwd)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"   Error: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        return False
    print(f"✅ Python version {version.major}.{version.minor}.{version.micro} is compatible")
    return True

def create_virtual_environment():
    """Create a virtual environment"""
    venv_path = Path("venv")
    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return True
    
    if not run_command("python3 -m venv venv", "Creating virtual environment"):
        return False
    return True

def install_dependencies():
    """Install Python dependencies in virtual environment"""
    # Determine the pip path based on OS
    if os.name == 'nt':  # Windows
        pip_path = "venv\\Scripts\\pip"
    else:  # Unix/Linux/macOS
        pip_path = "venv/bin/pip"
    
    if not run_command(f"{pip_path} install -r requirements.txt", "Installing Python dependencies"):
        return False
    return True

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_path = Path("backend/.env")
    if env_path.exists():
        print("✅ .env file already exists")
        return True
    
    print("📝 Creating .env file...")
    env_content = """# FastAPI Backend Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
BACKEND_PORT=8000
"""
    
    try:
        # Ensure backend directory exists
        env_path.parent.mkdir(exist_ok=True)
        with open(env_path, 'w') as f:
            f.write(env_content)
        print("✅ .env file created")
        print("⚠️  Please update the OPENAI_API_KEY in backend/.env with your actual API key")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def create_start_script():
    """Create a start script that activates the virtual environment"""
    if os.name == 'nt':  # Windows
        script_content = """@echo off
echo Starting FastAPI Backend...
call venv\\Scripts\\activate
cd backend
python start.py
pause
"""
        script_path = "start_backend.bat"
    else:  # Unix/Linux/macOS
        script_content = """#!/bin/bash
echo "Starting FastAPI Backend..."
source venv/bin/activate
cd backend
python start.py
"""
        script_path = "start_backend.sh"
    
    try:
        with open(script_path, 'w') as f:
            f.write(script_content)
        print(f"✅ Created start script: {script_path}")
        
        # Make the script executable on Unix systems
        if os.name != 'nt':  # Not Windows
            os.chmod(script_path, 0o755)
        
        return True
    except Exception as e:
        print(f"❌ Failed to create start script: {e}")
        return False

def main():
    """Main setup function"""
    print("=== FastAPI Backend Setup ===\n")
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create virtual environment
    if not create_virtual_environment():
        print("\n❌ Setup failed during virtual environment creation")
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed during dependency installation")
        sys.exit(1)
    
    # Create .env file
    if not create_env_file():
        print("\n❌ Setup failed during environment configuration")
        sys.exit(1)
    
    # Create start script
    if not create_start_script():
        print("\n❌ Setup failed during start script creation")
        sys.exit(1)
    
    print("\n=== Setup Complete ===")
    print("\nNext steps:")
    print("1. Update the OPENAI_API_KEY in backend/.env")
    print("2. Start the backend:")
    if os.name == 'nt':
        print("   start_backend.bat")
    else:
        print("   ./start_backend.sh")
    print("3. Test the backend: python test_fastapi_backend.py")
    print("4. Start the frontend: npm run dev")
    print("\nThe backend will be available at:")
    print("- API: http://localhost:8000")
    print("- Documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main() 
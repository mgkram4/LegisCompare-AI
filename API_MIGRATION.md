# API Migration: Python to TypeScript

This document describes the migration from the Python FastAPI backend to TypeScript API routes in Next.js.

## Migration Summary

### What Changed
- **Removed**: Python FastAPI backend (`/backend/` directory)
- **Added**: TypeScript API routes in `/app/api/` directory
- **Updated**: Frontend components to use new API endpoints

### New API Endpoints

#### 1. Compare Endpoint
- **URL**: `/api/compare`
- **Method**: `POST`
- **Purpose**: Analyzes and compares two legislative bills
- **Input**: FormData with `billA_file`, `billB_file`, `billA_text`, `billB_text`, or `demo=true`
- **Output**: Complete analysis including normalized bills, changes, stakeholders, forecast, bias analysis, and critique

#### 2. Health Check Endpoint
- **URL**: `/api/healthz`
- **Method**: `GET`
- **Purpose**: Checks API health and configuration status
- **Output**: Status information including OpenAI configuration

### Required Environment Variables

Create a `.env.local` file in your project root with:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Specify OpenAI model (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

### Dependencies Added

```json
{
  "openai": "^4.0.0",
  "pdf-parse": "^1.1.1",
  "@types/pdf-parse": "^1.1.4"
}
```

### File Processing

The TypeScript API now supports:
- **Text files**: `.txt`, `.md` files
- **PDF files**: Extracted using `pdf-parse` library
- **Demo mode**: Built-in sample bills for testing

### API Features

All original Python backend features are preserved:
1. **Bill Normalization**: Extracts hierarchical structure
2. **Section Alignment**: Matches similar sections between bills
3. **Diff Generation**: Creates git-style diffs with impact analysis
4. **Stakeholder Analysis**: Identifies affected parties
5. **Bias Detection**: Analyzes potential discriminatory impacts
6. **Forecast Generation**: Projects future outcomes
7. **Quality Critique**: Reviews analysis for accuracy

### Testing the Migration

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your OpenAI API key
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Test the health endpoint**:
   ```bash
   curl http://localhost:3000/api/healthz
   ```

5. **Upload and analyze bills** through the web interface

### Benefits of Migration

- **Simplified Architecture**: Single Node.js/TypeScript codebase
- **Better Development Experience**: Type safety and IDE support
- **Easier Deployment**: No need for separate Python backend
- **Consistent Dependencies**: Everything managed through npm
- **Environment Parity**: Same runtime for frontend and backend

### Troubleshooting

- **OpenAI API Errors**: Check that `OPENAI_API_KEY` is set correctly
- **PDF Processing Errors**: Ensure PDF files are not corrupted
- **Timeout Issues**: Large bills may take longer to process; consider increasing API timeout limits
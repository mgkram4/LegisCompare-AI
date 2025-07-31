# FastAPI Backend for Document Comparison

This FastAPI backend provides robust PDF text extraction and AI-powered document comparison functionality.

## Features

- **PDF Text Extraction**: Uses PyPDF2 for reliable text extraction from PDF files
- **AI Document Analysis**: Integrates with OpenAI for intelligent document comparison
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Configured for frontend integration
- **Comprehensive Logging**: Detailed logging for debugging and monitoring

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r ../requirements.txt
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
BACKEND_PORT=8000
```

### 3. Start the Backend

```bash
# Option 1: Using the startup script
python start.py

# Option 2: Direct uvicorn command
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Health Check
```
GET /health
```
Returns backend status and OpenAI configuration.

### Test PDF Extraction
```
POST /api/test-pdf
```
Test endpoint for PDF text extraction. Accepts a single PDF file.

**Request**: Form data with `file` field containing PDF
**Response**: JSON with extraction results and performance metrics

### Document Comparison
```
POST /api/compare
```
Compare two PDF documents using AI analysis.

**Request**: Form data with `bill_a_file` and `bill_b_file` fields
**Response**: JSON with comprehensive analysis including:
- Executive summary
- Key changes
- Stakeholder analysis
- Impact forecast

## Testing

### Test PDF Extraction
```bash
curl -X POST -F "file=@your-document.pdf" http://localhost:8000/api/test-pdf
```

### Test Document Comparison
```bash
curl -X POST \
  -F "bill_a_file=@document1.pdf" \
  -F "bill_b_file=@document2.pdf" \
  http://localhost:8000/api/compare
```

### Health Check
```bash
curl http://localhost:8000/health
```

## Integration with Frontend

The frontend is configured to use this backend by default. The API base URL can be customized using the `NEXT_PUBLIC_API_URL` environment variable.

## Error Handling

The API provides detailed error messages for:
- Invalid file types
- PDF processing failures
- OpenAI API errors
- Network issues

## Performance

- **PDF Processing**: Typically 100-500ms for standard PDFs
- **AI Analysis**: 5-15 seconds depending on document complexity
- **Memory Usage**: Efficient streaming for large files

## Troubleshooting

### Common Issues

1. **"No text could be extracted"**
   - PDF might be image-based or corrupted
   - Check PDF file integrity
   - Try with different PDF files

2. **"OpenAI API key not configured"**
   - Ensure `.env` file exists with valid API key
   - Check environment variable loading

3. **"CORS errors"**
   - Verify frontend origin is in allowed origins
   - Check network connectivity

### Debug Steps

1. Check backend logs for detailed error messages
2. Verify PDF files open in other applications
3. Test with smaller PDF files first
4. Check OpenAI API key validity

## Development

### Adding New Endpoints

1. Add endpoint function in `main.py`
2. Update API documentation
3. Test with appropriate test cases

### Modifying AI Analysis

1. Update the prompt in `analyze_documents_with_ai()`
2. Adjust response parsing as needed
3. Test with various document types

## Production Deployment

For production deployment:

1. Set `reload=False` in uvicorn configuration
2. Use proper WSGI server (Gunicorn + Uvicorn)
3. Configure proper CORS origins
4. Set up environment variables securely
5. Add rate limiting and authentication as needed 
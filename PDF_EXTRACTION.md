# PDF Text Extraction

This document describes the PDF text extraction functionality implemented in the application.

## Overview

The application now includes robust PDF text extraction capabilities similar to the Python PyPDF2 approach, with the following features:

- **Dual Library Support**: Uses both `pdf-parse` and `pdfjs-dist` for maximum compatibility
- **Fallback Mechanism**: If one library fails, automatically tries the other
- **Detailed Logging**: Comprehensive logging for debugging and monitoring
- **Error Handling**: Graceful error handling with informative error messages
- **Performance Monitoring**: Tracks processing time for optimization

## Implementation Details

### Main Function: `extractTextFromFile(file: File)`

Located in `lib/utils.ts`, this function:

1. **File Type Detection**: Automatically detects PDF and text files
2. **Buffer Conversion**: Converts File objects to Node.js Buffers
3. **Text Extraction**: Uses enhanced PDF parsing with fallback options
4. **Validation**: Ensures extracted text is not empty
5. **Error Reporting**: Provides detailed error information

### PDF Parsing Strategy

The system uses a two-tier approach:

1. **Primary**: `pdf-parse` library (faster, works for most PDFs)
2. **Fallback**: `pdfjs-dist` library (more robust, handles complex PDFs)

### Supported File Types

- **PDF files** (`.pdf`)
- **Text files** (`.txt`, `.text`)

## API Endpoints

### 1. Main Comparison Endpoint
```
POST /api/compare
```
- Accepts two PDF files for comparison
- Extracts text from both files
- Processes with OpenAI LLM for analysis

### 2. Test PDF Endpoint
```
POST /api/test-pdf
```
- Accepts a single PDF file for testing
- Returns detailed extraction information
- Useful for debugging and validation

## Testing

### Using the Test Script

Run the provided test script to verify PDF extraction:

```bash
node test_pdf_extraction.js
```

This will test extraction on sample PDFs and save extracted text to files.

### Manual Testing

You can also test via curl:

```bash
curl -X POST -F "file=@your-document.pdf" http://localhost:3000/api/test-pdf
```

## Error Handling

The system handles various error scenarios:

- **File not found**: Clear error message
- **Unsupported file type**: Informative error with supported types
- **PDF parsing failures**: Detailed error with fallback attempts
- **Empty PDF content**: Validation error
- **Network/API errors**: Graceful degradation

## Performance Considerations

- **Processing Time**: Typically 100-500ms for standard PDFs
- **Memory Usage**: Efficient buffer handling
- **Concurrent Processing**: Supports parallel file processing
- **Caching**: No caching implemented (files are processed on-demand)

## Logging

The system provides comprehensive logging:

```
=== EXTRACTING TEXT FROM FILES ===
Processing file: document.pdf (123456 bytes), type: pdf
File converted to buffer: 123456 bytes
Starting PDF text extraction for: document.pdf
Buffer size: 123456 bytes
PDF text extracted successfully using pdf-parse
Pages processed: 5
Text length: 15432 characters
Successfully extracted 15432 characters from PDF
=== TEXT EXTRACTION COMPLETED ===
Extraction time: 234ms
```

## Troubleshooting

### Common Issues

1. **"No text could be extracted"**
   - PDF might be image-based or corrupted
   - Try different PDF library
   - Check PDF file integrity

2. **"Unsupported file type"**
   - Ensure file has correct extension
   - Check file is actually PDF format

3. **"Processing failed"**
   - Check file size (very large files may timeout)
   - Verify PDF is not password-protected
   - Ensure sufficient memory available

### Debug Steps

1. Use the test endpoint to isolate issues
2. Check server logs for detailed error messages
3. Verify PDF file opens in other applications
4. Test with smaller PDF files first

## Future Enhancements

Potential improvements:

- **OCR Support**: For image-based PDFs
- **Password Protection**: Handle encrypted PDFs
- **Batch Processing**: Process multiple files efficiently
- **Caching**: Cache extracted text for repeated use
- **Compression**: Handle very large PDF files 
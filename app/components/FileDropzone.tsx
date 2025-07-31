
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css'; // Import AnnotationLayer styles
import 'react-pdf/dist/Page/TextLayer.css'; // Import TextLayer styles

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FileDropzoneProps {
  onFileAccepted: (file: File, textContent: string) => void;
  label: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileAccepted, label }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    if (fileType === 'text/plain' || fileType === 'text/markdown') {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      });
    } else if (fileType === 'application/pdf') {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;
          let fullText = '';
          // TextItem interface for PDF text extraction
          interface TextItem {
            str: string;
          }
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item) => {
                if (typeof item === 'object' && 'str' in item) {
                    return (item as TextItem).str;
                }
                return ''; // Handle TextMarkedContent or other types
            }).join(' ') + '\n';
          }
          resolve(fullText);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    } else {
      return Promise.reject('Unsupported file type');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        console.log('File dropped or selected:', file.name, file.type);
        const textContent = await extractTextFromFile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
          setFileType(file.type);
        };
        reader.readAsDataURL(file);
        onFileAccepted(file, textContent);
      } catch (error) {
        console.error('Error processing file:', error);
        setPreview(null);
        setFileType(null);
        alert('Failed to read file. Please ensure it is a valid .txt, .md, or .pdf file.');
      }
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md'],
    },
    multiple: false,
  });

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
    >
      <input {...getInputProps()} />
      {preview && fileType === 'application/pdf' ? (
        <div className="flex flex-col items-center">
          <Document
            file={preview}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
            className="w-full max-w-xs"
          >
            <Page pageNumber={1} width={200} />
          </Document>
          <p className="mt-2 text-sm text-gray-500">{numPages} pages</p>
          <p className="mt-2 text-sm text-gray-500">File uploaded: {label}</p>
        </div>
      ) : preview && (fileType === 'text/plain' || fileType === 'text/markdown') ? (
        <div className="flex flex-col items-center">
          <p className="text-xl text-green-500">File uploaded!</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      ) : (
        <p className="text-gray-500">
          {isDragActive
            ? 'Drop the files here ...'
            : `Drag 'n' drop ${label} here, or click to select files`}
        </p>
      )}
    </div>
  );
};

export default FileDropzone; 
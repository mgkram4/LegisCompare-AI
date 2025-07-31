// app/compare/page.tsx
'use client';

import FileUpload from '@/components/homepage/FileUpload';

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900">
                Document Comparison
            </h1>
            <p className="mt-2 text-lg text-slate-600">
                Upload two versions of a document to see a detailed analysis of the changes.
            </p>
        </header>

        <main>
          <FileUpload />
        </main>
      </div>
    </div>
  );
}

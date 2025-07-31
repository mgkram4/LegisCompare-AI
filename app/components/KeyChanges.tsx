// app/components/KeyChanges.tsx

interface KeyChange {
  topic: string;
  description: string;
  impact: string;
  original_quote: string;
  proposed_quote: string;
}

export function KeyChanges({ changes, showQuotes }: { changes: KeyChange[], showQuotes?: boolean }) {
  return (
    <section id="key-changes">
      <h2 className="text-2xl font-semibold text-slate-800 border-b-2 border-slate-300 pb-2 mb-6">
        Key Changes
      </h2>
      <div className="space-y-8">
        {changes.map((change, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">{change.topic}</h3>
            <p className="text-slate-600 mb-4">{change.description}</p>
            <p className="text-slate-800 font-medium mb-4"><span className="font-semibold">Impact:</span> {change.impact}</p>
            {showQuotes && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-sm font-semibold text-red-800 mb-2">Original</p>
                  <blockquote className="text-red-900 italic border-l-4 border-red-400 pl-4">
                    {change.original_quote}
                  </blockquote>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm font-semibold text-green-800 mb-2">Proposed</p>
                  <blockquote className="text-green-900 italic border-l-4 border-green-400 pl-4">
                    {change.proposed_quote}
                  </blockquote>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

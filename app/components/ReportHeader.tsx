// app/components/ReportHeader.tsx

import { format } from 'date-fns';

interface ReportHeaderProps {
    billAName: string;
    billBName: string;
    subject: string;
    reportDate: string;
}

export function ReportHeader({ billAName, billBName, subject, reportDate }: ReportHeaderProps) {
    const formattedDate = format(new Date(reportDate), "MMMM d, yyyy 'at' h:mm a");
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-5xl mx-auto p-4 md:p-6">
                <h1 className="text-3xl font-bold text-slate-900">Legislative Analysis Report</h1>
                <p className="text-slate-600">A comparison between <span className="font-semibold">{billAName}</span> and <span className="font-semibold">{billBName}</span>.</p>
                <div className="mt-4 text-sm text-slate-500">
                    <p><span className="font-semibold">Subject:</span> {subject}</p>
                    <p><span className="font-semibold">Report Generated:</span> {formattedDate}</p>
                </div>
            </div>
        </header>
    );
}

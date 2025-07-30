
import React from 'react';

interface LineByLineViewerProps {
  billA: string;
  billB: string;
}

const LineByLineViewer: React.FC<LineByLineViewerProps> = ({ billA, billB }) => {
  const linesA = billA.split('\n');
  const linesB = billB.split('\n');
  const maxLines = Math.max(linesA.length, linesB.length);

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < maxLines; i++) {
      lines.push(
        <div key={i} className="flex">
          <div className="w-1/2 pr-2 border-r">
            <span className="text-gray-500 mr-2">{i + 1}</span>
            <span>{linesA[i] || ''}</span>
          </div>
          <div className="w-1/2 pl-2">
            <span className="text-gray-500 mr-2">{i + 1}</span>
            <span>{linesB[i] || ''}</span>
          </div>
        </div>
      );
    }
    return lines;
  };

  return (
    <div className="font-mono text-sm">
      <div className="flex bg-gray-800 p-2 rounded-t-md">
        <div className="w-1/2 pr-2 border-r font-bold">Bill A</div>
        <div className="w-1/2 pl-2 font-bold">Bill B</div>
      </div>
      <div className="p-2 bg-gray-900 rounded-b-md">{renderLines()}</div>
    </div>
  );
};

export default LineByLineViewer;

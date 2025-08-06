'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Stakeholder {
  name: string;
  category: string;
  effect: 'benefit' | 'harm' | 'mixed';
  description: string;
  evidence_quote: string;
}

const effectColors = {
    benefit: '#22c55e', // green-500
    harm: '#ef4444',    // red-500
    mixed: '#f59e0b',   // amber-500
};

export function StakeholderAnalysis({ stakeholders, groupByCategory }: { stakeholders: Stakeholder[], groupByCategory?: boolean }) {

  const groupedStakeholders = groupByCategory
    ? stakeholders.reduce((acc, stakeholder) => {
        const category = stakeholder.category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(stakeholder);
        return acc;
      }, {} as Record<string, Stakeholder[]>)
    : { 'All Stakeholders': stakeholders };

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean; 
    payload?: Array<{ payload: { fullData: Stakeholder } }>; 
    label?: string 
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload.fullData;
      return (
        <div className="p-4 bg-white border border-slate-300 rounded-lg shadow-lg">
          <p className="font-bold text-slate-800">{label}</p>
          <p className="text-sm text-slate-600 capitalize">{data.category}</p>
          <p className="mt-2 text-slate-700">{data.description}</p>
          <blockquote className="mt-2 text-xs italic text-slate-500 border-l-2 border-slate-300 pl-2">
            {data.evidence_quote}
          </blockquote>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="stakeholder-analysis">
      <h2 className="text-2xl font-semibold text-slate-800 border-b-2 border-slate-300 pb-2 mb-6">
        Stakeholder Analysis
      </h2>
      <div className="space-y-8">
        {Object.entries(groupedStakeholders).map(([category, group]) => {
          const chartData = group.map(s => ({
            name: s.name,
            benefit: s.effect === 'benefit' ? 1 : 0,
            harm: s.effect === 'harm' ? -1 : 0,
            mixed: s.effect === 'mixed' ? 0.5 : 0, // Use a different value for mixed to avoid overlap issue
            fullData: s,
          }));

          return (
            <div key={category} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">{category}</h3>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[-1, 1]} tickFormatter={(value) => {
                      if (value === -1) return 'Harm';
                      if (value === 1) return 'Benefit';
                      return '';
                    }} />
                    <YAxis dataKey="name" type="category" width={150} interval={0} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="benefit" stackId="a" fill={effectColors.benefit} name="Positive Impact" />
                    <Bar dataKey="harm" stackId="a" fill={effectColors.harm} name="Negative Impact" />
                    <Bar dataKey="mixed" stackId="a" fill={effectColors.mixed} name="Mixed Impact" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

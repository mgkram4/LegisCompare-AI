import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface Stakeholder {
  name?: string;
  category?: "industry" | "demographic" | "institution" | "ngo" | "other";
  effect?: "benefit" | "harm" | "mixed";
  magnitude?: "low" | "medium" | "high";
  mechanism?: string;
  time_horizon?: "short" | "medium" | "long";
  linked_changes?: string[];
  confidence?: "low" | "medium" | "high";
}

interface StakeholderChartProps {
  stakeholders: Stakeholder[];
}

const COLORS = {
  benefit: '#84fab0',
  harm: '#fa709a',
  mixed: '#fee140',
};

const StakeholderChart: React.FC<StakeholderChartProps> = ({
  stakeholders,
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={stakeholders}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        fill="#8884d8"
        dataKey="magnitude"
        nameKey="name"
      >
        {stakeholders.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[entry.effect || 'mixed']} />
        ))}
      </Pie>
      <Tooltip formatter={(value: number, name: string, props: { payload?: Stakeholder }) => [
        `${props.payload?.magnitude} (${props.payload?.effect})`,
        props.payload?.name,
      ]} />
      <Legend layout="vertical" align="right" verticalAlign="middle" />
    </PieChart>
  </ResponsiveContainer>
);

export default StakeholderChart; 
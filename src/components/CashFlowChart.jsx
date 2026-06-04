import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectCashFlows, discountCashFlows } from '../engine/dcf.js';

export default function CashFlowChart({ inputs }) {
  const flows = projectCashFlows(inputs.baseFCF, inputs.growthRate, inputs.years);
  const discounted = discountCashFlows(flows, inputs.discountRate);

  const data = flows.map((f, i) => ({
    year: `Y${i + 1}`,
    Projected: Number(f.toFixed(2)),
    Discounted: Number(discounted[i].toFixed(2)),
  }));

  return (
    <div style={{ marginTop: '2rem', width: '100%', height: 280 }}>
      <h3>Projected vs discounted FCF ($B)</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Projected" fill="#8884d8" />
          <Bar dataKey="Discounted" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
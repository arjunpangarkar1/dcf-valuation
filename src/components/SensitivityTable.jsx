import { calculateDCF } from '../engine/dcf.js';

export default function SensitivityTable({ inputs, marketPrice }) {
  const waccs = [0.06, 0.07, 0.08, 0.09, 0.10];        // rows
  const growths = [0.015, 0.02, 0.025, 0.03, 0.035];   // columns

  const cell = { border: '1px solid #ccc', padding: '6px 10px', textAlign: 'center' };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Sensitivity: value per share (rows = WACC, columns = terminal growth)</h3>
      <table style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={cell}>WACC / g</th>
            {growths.map((g) => <th key={g} style={cell}>{(g * 100).toFixed(1)}%</th>)}
          </tr>
        </thead>
        <tbody>
          {waccs.map((w) => (
            <tr key={w}>
              <th style={cell}>{(w * 100).toFixed(0)}%</th>
              {growths.map((g) => {
                const v = calculateDCF({ ...inputs, discountRate: w, terminalGrowth: g });
                const bg = v > marketPrice ? '#d6f5d6' : '#f8d6d6';
                return <td key={g} style={{ ...cell, backgroundColor: bg }}>${v.toFixed(0)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
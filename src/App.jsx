import { useState, useEffect } from 'react';
import { calculateDCF } from './engine/dcf.js';
import './App.css';
import SensitivityTable from './components/SensitivityTable.jsx';
import CashFlowChart from './components/CashFlowChart.jsx';

function App() {
  const [inputs, setInputs] = useState({
    baseFCF: 2.5,
    growthRate: 0.05,
    years: 5,
    discountRate: 0.08,
    terminalGrowth: 0.025,
    netDebt: -1.2,
    sharesOutstanding: 1.48,
  });
  const [marketPrice, setMarketPrice] = useState(43.81);

  useEffect(() => {
    const key = import.meta.env.VITE_ALPHAVANTAGE_KEY;
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=NKE&apikey=${key}`)
      .then((res) => res.json())
      .then((data) => {
        const price = Number(data['Global Quote']?.['05. price']);
        if (price) setMarketPrice(price);
      })
      .catch((err) => console.error('Price fetch failed:', err));
  }, []);

  const updateInput = (field, value) => setInputs({ ...inputs, [field]: value });

  const value = calculateDCF(inputs);
  const diff = (value - marketPrice) / marketPrice;
  const undervalued = value > marketPrice;
  const verdict = undervalued ? 'Undervalued' : 'Overvalued';
  const color = undervalued ? '#37c47a' : '#ff5c6c';

  return (
    <div>
      <h1>Nike DCF Valuation</h1>

      <div className="grid">
        <div className="card">
          <h2>Assumptions</h2>

          <label>
            Base FCF: ${inputs.baseFCF.toFixed(1)}B
            <input type="range" min="1" max="6" step="0.1"
              value={inputs.baseFCF}
              onChange={(e) => updateInput('baseFCF', Number(e.target.value))} />
          </label>

          <label>
            Growth rate: {(inputs.growthRate * 100).toFixed(1)}%
            <input type="range" min="0" max="0.2" step="0.005"
              value={inputs.growthRate}
              onChange={(e) => updateInput('growthRate', Number(e.target.value))} />
          </label>

          <label>
            Projection years: {inputs.years}
            <input type="range" min="3" max="10" step="1"
              value={inputs.years}
              onChange={(e) => updateInput('years', Number(e.target.value))} />
          </label>

          <label>
            WACC (discount rate): {(inputs.discountRate * 100).toFixed(1)}%
            <input type="range" min="0.05" max="0.15" step="0.0025"
              value={inputs.discountRate}
              onChange={(e) => updateInput('discountRate', Number(e.target.value))} />
          </label>

          <label>
            Terminal growth: {(inputs.terminalGrowth * 100).toFixed(1)}%
            <input type="range" min="0" max="0.04" step="0.0025"
              value={inputs.terminalGrowth}
              onChange={(e) => updateInput('terminalGrowth', Number(e.target.value))} />
          </label>

          <label>
            Market price: ${marketPrice.toFixed(2)}
            <input type="range" min="30" max="90" step="0.5"
              value={marketPrice}
              onChange={(e) => setMarketPrice(Number(e.target.value))} />
          </label>
        </div>

        <div className="card">
          <h2>Valuation</h2>
          <div className="value">${value.toFixed(2)} <span className="per">/ share</span></div>
          <div className="verdict" style={{ color }}>{verdict} by {Math.abs(diff * 100).toFixed(1)}%</div>
          <CashFlowChart inputs={inputs} />
        </div>
      </div>

      <div className="card table-card">
        <SensitivityTable inputs={inputs} marketPrice={marketPrice} />
      </div>
    </div>
  );
}

export default App;
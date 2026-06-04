# Nike DCF Valuation

An interactive discounted cash flow (DCF) tool that estimates the intrinsic value of NIKE, Inc. (NYSE: NKE) and compares it against the live market price to flag whether the stock looks over- or undervalued. Built to make the assumption-sensitivity of equity valuation tangible — every input is adjustable, and the output updates instantly.

**Live demo:** https://dcf-valuation-kappa.vercel.app/
**Repo:** https://github.com/arjunpangarkar1/dcf-valuation

## What it does

- Projects free cash flow forward, discounts it to present value at a chosen WACC, adds a terminal value, and bridges from enterprise value to an intrinsic value per share.
- Pulls Nike's current share price live from the Alpha Vantage API and labels the result **Overvalued** or **Undervalued** with the percentage gap.
- Renders a WACC × terminal-growth sensitivity table (color-coded against the market price) so you can see how far the valuation swings with just two assumptions.
- Visualizes projected vs. discounted cash flows per year to show the effect of discounting over time.

## How the valuation works

The model uses an unlevered (FCFF) approach:

1. **Project cash flows** — grow a base free cash flow figure at an assumed rate over N years.
2. **Discount** each year to present value using the WACC.
3. **Terminal value** — capture all cash beyond the projection window via the Gordon Growth (perpetuity) formula, then discount it back to today.
4. **Bridge to equity** — sum the discounted cash flows and terminal value to get enterprise value, then add net cash (or subtract net debt) and divide by shares outstanding.

Nike's starting figures (free cash flow, share count, and net cash position) are seeded from its FY2025 financials; all model assumptions are user-adjustable.

> This is an educational modeling tool, not investment advice. A DCF's output is only as reliable as its assumptions.

## Tech stack

- **React + Vite** — UI and build tooling
- **Recharts** — cash flow chart
- **Alpha Vantage API** — live share price
- **Vercel** — hosting and continuous deployment

## Running locally

\`\`\`bash
git clone https://github.com/arjunpangarkar1/dcf-valuation.git
cd dcf-valuation
npm install
\`\`\`

Create a `.env.local` file in the project root with your Alpha Vantage API key:

\`\`\`
VITE_ALPHAVANTAGE_KEY=your_key_here
\`\`\`

Then start the dev server:

\`\`\`bash
npm run dev
\`\`\`

## Project structure

\`\`\`
src/
  engine/dcf.js              # pure DCF math (project, discount, terminal value, full valuation)
  components/
    SensitivityTable.jsx     # WACC x terminal-growth heatmap
    CashFlowChart.jsx        # projected vs discounted FCF chart
  App.jsx                    # state, live price fetch, layout
\`\`\`

The valuation logic lives entirely in `engine/dcf.js`, fully separated from the UI so it can be tested and reused independently.

## Notes & limitations

- The Alpha Vantage free tier is rate-limited (~25 calls/day).
- The API key is bundled client-side; a production build would proxy it through a backend.
- Model assumptions are deliberately manual — exercising judgment about the future is the entire point of a DCF.

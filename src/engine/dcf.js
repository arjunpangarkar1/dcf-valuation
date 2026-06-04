// src/engine/dcf.js

// Piece 1: Project future free cash flows.
// Take this year's FCF and grow it by `growthRate` each year, for `years` years.
export function projectCashFlows(baseFCF, growthRate, years) {
  const cashFlows = [];
  let fcf = baseFCF;

  for (let year = 1; year <= years; year++) {
    fcf = fcf * (1 + growthRate); // grow last year's FCF
    cashFlows.push(fcf);          // store this year's projected FCF
  }

  return cashFlows; // an array of N projected cash flows
}

// Piece 2: Discount each future cash flow to today's value.
// A dollar in year N is worth less now, so divide by (1 + discountRate)^year.
export function discountCashFlows(cashFlows, discountRate) {
  return cashFlows.map((fcf, index) => {
    const year = index + 1; // array position 0 is year 1
    return fcf / (1 + discountRate) ** year;
  });
}

// Piece 3: Terminal value — all cash flows beyond year 5, as one number (valued at year 5).
export function terminalValue(lastFCF, discountRate, terminalGrowth) {
  return (lastFCF * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
}

// Piece 4: Full DCF — turn all the pieces into one intrinsic value per share.
export function calculateDCF({
  baseFCF, growthRate, years, discountRate, terminalGrowth, netDebt, sharesOutstanding,
}) {
  // 1. Project + discount the explicit cash flows, then sum them
  const flows = projectCashFlows(baseFCF, growthRate, years);
  const discounted = discountCashFlows(flows, discountRate);
  const sumDiscounted = discounted.reduce((sum, fcf) => sum + fcf, 0);

  // 2. Terminal value, discounted back to today
  const lastFCF = flows[flows.length - 1];
  const tv = terminalValue(lastFCF, discountRate, terminalGrowth);
  const discountedTV = tv / (1 + discountRate) ** years;

  // 3. Enterprise value = explicit cash flows + terminal value
  const enterpriseValue = sumDiscounted + discountedTV;

  // 4. Bridge to equity, then per share
  const equityValue = enterpriseValue - netDebt; // Nike's netDebt is negative, so this adds its net cash
  return equityValue / sharesOutstanding;
}
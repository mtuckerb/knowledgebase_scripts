
const config = {
  fica_tax_rate: 0.062,
  insurance_tax_rate: 0.075,
  annual_tax_rate: 0.3,
  annual_deductions_limit: 10000,
  annual_standard_deduction: 14600,
  annual_married_deduction: 29200,
  annual_child_deduction: 4000,
  dependent_deduction_max: 14600,
  federal_tax_brackets: {
    single: [
      { min: 0, max: 11600, rate: 0.1 },
      { min: 11601, max: 47150, rate: 0.12 },
      { min: 47151, max: 100525, rate: 0.22 },
      { min: 100526, max: 191950, rate: 0.24 },
      { min: 191951, max: 243725, rate: 0.32 },
      { min: 243726, max: 609350, rate: 0.35 },
      { min: 609351, max: Infinity, rate: 0.37 },
    ],
    joint: [
      { min: 0, max: 23200, rate: 0.1 },
      { min: 23201, max: 94300, rate: 0.12 },
      { min: 94301, max: 188650, rate: 0.22 },
      { min: 188651, max: 377300, rate: 0.24 },
      { min: 377301, max: 471500, rate: 0.32 },
      { min: 471501, max: 1005250, rate: 0.35 },
      { min: 1005251, max: Infinity, rate: 0.37 },
    ],
  },
  state_tax_brackets: [
    {
      state: 'ME',
      brackets: {
        single: [
          { min: 0, max: 26050, rate: 0.058 },
          { min: 26051, max: 61600, rate: 0.0675 },
          { min: 61601, max: Infinity, rate: 0.0715 },
        ],
        joint: [
          { min: 0, max: 52100, rate: 0.058 },
          { min: 52101, max: 123200, rate: 0.0675 },
          { min: 123201, max: Infinity, rate: 0.0715 },
        ],
      },
    },
    {
      state: 'CA',
      brackets: {
        single: [
          { min: 0, max: 10000, rate: 0.02 },
          { min: 10001, max: 50000, rate: 0.04 },
          { min: 50001, max: Infinity, rate: 0.06 },
        ],
        joint: [
          { min: 0, max: 20000, rate: 0.02 },
          { min: 20001, max: 100000, rate: 0.04 },
          { min: 100001, max: Infinity, rate: 0.06 },
        ],
      },
    },
  ],
};
function calculateAnnualTakeHome(income, deductions, married, dependentsSalaries, state, filingStatus) {
  // Calculate total deductions
  const totalDeductions = deductions + dependentsSalaries.reduce((total, salary) => total + Math.min(config.dependent_deduction_max, Math.max(1300, (salary + 450))), 0);

  // Calculate adjusted gross income (AGI)
  const adjustedGrossIncome = income - totalDeductions;

  // Calculate taxable income
  const taxableIncome = adjustedGrossIncome - (filingStatus === 'joint' ? config.annual_married_deduction : config.annual_standard_deduction);

  // Calculate federal tax
  let federalTax = 0;
  const federalTaxBrackets = filingStatus === 'joint' ? config.federal_tax_brackets.joint : config.federal_tax_brackets.single;

  for (const bracket of federalTaxBrackets) {
    if (taxableIncome > bracket.min) {
      const bracketIncome = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
      federalTax += bracketIncome * bracket.rate;
    } else {
      break;
    }
  }

  // Calculate state tax
  let stateTax = 0;
  const stateTaxBrackets = config.state_tax_brackets.find(s => s.state === state).brackets[filingStatus === 'joint' ? 'joint' : 'single'];

  for (const bracket of stateTaxBrackets) {
    if (taxableIncome > bracket.min) {
      const bracketIncome = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
      stateTax += bracketIncome * bracket.rate;
    } else {
      break;
    }
  }

  // Calculate fica tax
  const ficaTax = taxableIncome * config.fica_tax_rate;

  // Calculate insurance tax
  const insuranceTax = taxableIncome * config.insurance_tax_rate;

  // Calculate total tax
  const totalTax = federalTax + stateTax + ficaTax + insuranceTax;

  // Calculate annual take-home salary
  const annualTakeHome = income - totalTax;

  return annualTakeHome;
}

// Function to calculate monthly take-home salary
function calculateMonthlyTakeHome(annualTakeHome) {
  const monthlyTakeHome = annualTakeHome / 12;
  return monthlyTakeHome;
}

// Export the functions
module.exports = {
  calculateAnnualTakeHome,
  calculateMonthlyTakeHome,
}
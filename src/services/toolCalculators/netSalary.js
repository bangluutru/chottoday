/**
 * NET SALARY CALCULATOR (手取り) — /tools/luong-thuc-nhan
 *
 * Ported verbatim from the "Chotto - Cong cu chi tiet" design handoff (§5.2).
 * Kept free of React so the numbers can be unit-tested on their own
 * (`npm run test:net-salary`).
 *
 * Privacy: every value below is derived in memory from what the visitor typed.
 * Nothing here is persisted, put in the URL, or sent anywhere.
 */

/** Monthly salary, in man yen, that the input and the slider accept. */
export const SALARY_MAN_MIN = 5;
export const SALARY_MAN_MAX = 200;
export const SALARY_SLIDER_MIN = 10;
export const SALARY_SLIDER_MAX = 100;
export const DEFAULT_SALARY_MAN = 30;

export const DEPENDENTS_MIN = 0;
export const DEPENDENTS_MAX = 6;

export const BONUS_OPTIONS = [
  { label: 'Không có', months: 0 },
  { label: '1 tháng', months: 1 },
  { label: '2 tháng', months: 2 },
  { label: '4 tháng', months: 4 },
];

/** Employee share of health insurance, which is set per prefecture. */
export const REGIONS = [
  { label: 'Tokyo', health: 0.0499 },
  { label: 'Osaka', health: 0.0516 },
  { label: 'Aichi', health: 0.0501 },
  { label: 'Khác', health: 0.0495 },
];

/** Employee pension (厚生年金) and employment insurance (雇用保険) shares. */
const PENSION_RATE = 0.0915;
const EMPLOYMENT_INSURANCE_RATE = 0.006;

/** Basic deduction for national income tax and for resident tax. */
const NATIONAL_BASIC_DEDUCTION = 480000;
const LOCAL_BASIC_DEDUCTION = 430000;
const NATIONAL_DEPENDENT_DEDUCTION = 380000;
const LOCAL_DEPENDENT_DEDUCTION = 330000;

/** Resident tax: 10% of taxable income plus the flat per-capita levy. */
const RESIDENT_TAX_RATE = 0.1;
const RESIDENT_TAX_FLAT = 5000;

/** Special reconstruction income tax surcharge (復興特別所得税), 2.1%. */
const RECONSTRUCTION_SURCHARGE = 1.021;

const YEN_FORMAT = new Intl.NumberFormat('vi-VN');

/** Formats a yen amount the way the design does: "237.123 ¥". */
export function formatYen(value) {
  return `${YEN_FORMAT.format(Math.round(value))} ¥`;
}

/** Employment income deduction (給与所得控除) for an annual gross. */
export function employmentIncomeDeduction(gross) {
  if (gross <= 1625000) return 550000;
  if (gross <= 1800000) return gross * 0.4 - 100000;
  if (gross <= 3600000) return gross * 0.3 + 80000;
  if (gross <= 6600000) return gross * 0.2 + 440000;
  if (gross <= 8500000) return gross * 0.1 + 1100000;
  return 1950000;
}

/** Progressive national income tax, including the reconstruction surcharge. */
export function nationalIncomeTax(taxable) {
  if (taxable <= 0) return 0;
  let tax;
  if (taxable <= 1950000) tax = taxable * 0.05;
  else if (taxable <= 3300000) tax = taxable * 0.1 - 97500;
  else if (taxable <= 6950000) tax = taxable * 0.2 - 427500;
  else if (taxable <= 9000000) tax = taxable * 0.23 - 636000;
  else if (taxable <= 18000000) tax = taxable * 0.33 - 1536000;
  else tax = taxable * 0.4 - 2796000;
  return tax * RECONSTRUCTION_SURCHARGE;
}

export function clampSalaryMan(value) {
  const parsed = Number(value);
  const safe = Number.isFinite(parsed) ? parsed : 0;
  return Math.min(SALARY_MAN_MAX, Math.max(SALARY_MAN_MIN, safe));
}

export function findRegion(label) {
  return REGIONS.find((region) => region.label === label) || REGIONS[0];
}

/**
 * Yearly breakdown for a monthly gross salary.
 *
 * @param {Object} input
 * @param {number|string} input.man       Monthly gross salary in man yen.
 * @param {number} input.bonusMonths      Extra months of salary paid as bonus.
 * @param {number} input.dependents       Registered dependents (0–6).
 * @param {string} input.region           One of REGIONS[].label.
 * @returns {{gross:number, social:number, incomeTax:number, residentTax:number,
 *            totalDeduction:number, net:number, deductionRate:number}}
 *          All amounts are yearly, in yen; deductionRate is a fraction of gross.
 */
export function calculateNetSalary({
  man = DEFAULT_SALARY_MAN,
  bonusMonths = 2,
  dependents = 0,
  region = REGIONS[0].label,
} = {}) {
  const monthly = clampSalaryMan(man) * 10000;
  const gross = monthly * (12 + bonusMonths);
  const { health } = findRegion(region);

  const social = gross * (health + PENSION_RATE + EMPLOYMENT_INSURANCE_RATE);
  const deps = Math.min(DEPENDENTS_MAX, Math.max(DEPENDENTS_MIN, dependents || 0));

  const base = gross - social - employmentIncomeDeduction(gross);
  const taxableNational = Math.max(
    0,
    base - NATIONAL_BASIC_DEDUCTION - deps * NATIONAL_DEPENDENT_DEDUCTION
  );
  const taxableLocal = Math.max(
    0,
    base - LOCAL_BASIC_DEDUCTION - deps * LOCAL_DEPENDENT_DEDUCTION
  );

  const incomeTax = nationalIncomeTax(taxableNational);
  const residentTax = taxableLocal * RESIDENT_TAX_RATE + RESIDENT_TAX_FLAT;
  const totalDeduction = social + incomeTax + residentTax;

  return {
    gross,
    social,
    incomeTax,
    residentTax,
    totalDeduction,
    net: gross - totalDeduction,
    deductionRate: gross > 0 ? totalDeduction / gross : 0,
  };
}

/**
 * The three deduction rows under the result card.
 *
 * `percent` is the bar width, not the real share: each deduction is a small
 * slice of gross, so the design scales it ×3 and clamps at 100 to keep the
 * bars readable against each other.
 */
export function buildDeductionRows(result) {
  const perMonth = (yearly) => yearly / 12;
  const barWidth = (yearly) =>
    result.gross > 0 ? Math.min(100, (yearly / result.gross) * 100 * 3) : 0;

  return [
    {
      key: 'social',
      label: 'Bảo hiểm xã hội',
      amount: perMonth(result.social),
      percent: barWidth(result.social),
      color: 'var(--chotto-cyan)',
      note: 'Y tế + nenkin + bảo hiểm lao động',
    },
    {
      key: 'income-tax',
      label: 'Thuế thu nhập',
      amount: perMonth(result.incomeTax),
      percent: barWidth(result.incomeTax),
      color: 'var(--chotto-violet)',
      note: 'Bậc lũy tiến, gồm thuế phục hồi 2,1%',
    },
    {
      key: 'resident-tax',
      label: 'Thuế thị dân',
      amount: perMonth(result.residentTax),
      percent: barWidth(result.residentTax),
      color: 'var(--chotto-orange)',
      note: 'Khoảng 10% thu nhập chịu thuế',
    },
  ];
}

/**
 * Unit tests for the net-salary calculator behind /tools/luong-thuc-nhan.
 *
 * The formula is a contract with the design handoff (§5.2): the bracket
 * boundaries, the per-prefecture health rates and the dependent deductions are
 * all load-bearing, so each one is pinned here rather than spot-checked.
 */

import {
  BONUS_OPTIONS,
  DEFAULT_SALARY_MAN,
  DEPENDENTS_MAX,
  REGIONS,
  SALARY_MAN_MAX,
  SALARY_MAN_MIN,
  buildDeductionRows,
  calculateNetSalary,
  clampSalaryMan,
  employmentIncomeDeduction,
  findRegion,
  formatYen,
  nationalIncomeTax,
} from '../src/services/toolCalculators/netSalary.js';

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

function assertClose(actual, expected, message, tolerance = 0.5) {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (!ok) {
    console.error(`     expected ≈ ${expected}, got ${actual}`);
  }
  assert(ok, message);
}

console.log('\n========================================================');
console.log('NET SALARY CALCULATOR TESTS');
console.log('========================================================\n');

// 1. Employment income deduction brackets (給与所得控除)
console.log('--- GROUP 1: EMPLOYMENT INCOME DEDUCTION BRACKETS ---');
assertClose(employmentIncomeDeduction(1_000_000), 550_000, 'Below 1.625M yields the 550k floor');
assertClose(employmentIncomeDeduction(1_625_000), 550_000, 'Exactly 1.625M still yields 550k');
assertClose(employmentIncomeDeduction(1_700_000), 1_700_000 * 0.4 - 100_000, '1.625M–1.8M uses 40% − 100k');
assertClose(employmentIncomeDeduction(1_800_000), 1_800_000 * 0.4 - 100_000, 'Upper edge 1.8M stays in the 40% band');
assertClose(employmentIncomeDeduction(3_000_000), 3_000_000 * 0.3 + 80_000, '1.8M–3.6M uses 30% + 80k');
assertClose(employmentIncomeDeduction(5_000_000), 5_000_000 * 0.2 + 440_000, '3.6M–6.6M uses 20% + 440k');
assertClose(employmentIncomeDeduction(7_000_000), 7_000_000 * 0.1 + 1_100_000, '6.6M–8.5M uses 10% + 1.1M');
assertClose(employmentIncomeDeduction(9_000_000), 1_950_000, 'Above 8.5M is capped at 1.95M');

// 2. Progressive income tax brackets, including the 2.1% surcharge
console.log('\n--- GROUP 2: PROGRESSIVE INCOME TAX ---');
assert(nationalIncomeTax(0) === 0, 'Zero taxable income owes no tax');
assert(nationalIncomeTax(-50_000) === 0, 'Negative taxable income owes no tax');
assertClose(nationalIncomeTax(1_000_000), 1_000_000 * 0.05 * 1.021, 'First bracket is 5% × 1.021');
assertClose(nationalIncomeTax(3_000_000), (3_000_000 * 0.1 - 97_500) * 1.021, 'Second bracket is 10% − 97.5k');
assertClose(nationalIncomeTax(5_000_000), (5_000_000 * 0.2 - 427_500) * 1.021, 'Third bracket is 20% − 427.5k');
assertClose(nationalIncomeTax(8_000_000), (8_000_000 * 0.23 - 636_000) * 1.021, 'Fourth bracket is 23% − 636k');
assertClose(nationalIncomeTax(12_000_000), (12_000_000 * 0.33 - 1_536_000) * 1.021, 'Fifth bracket is 33% − 1.536M');
assertClose(nationalIncomeTax(20_000_000), (20_000_000 * 0.4 - 2_796_000) * 1.021, 'Top bracket is 40% − 2.796M');

// 3. Input clamping
console.log('\n--- GROUP 3: INPUT CLAMPING ---');
assert(clampSalaryMan(0) === SALARY_MAN_MIN, 'Zero clamps up to the 5 man floor');
assert(clampSalaryMan(500) === SALARY_MAN_MAX, '500 clamps down to the 200 man ceiling');
assert(clampSalaryMan('42') === 42, 'A numeric string is accepted');
assert(clampSalaryMan('') === SALARY_MAN_MIN, 'An empty input falls back to the floor, never NaN');
assert(clampSalaryMan('abc') === SALARY_MAN_MIN, 'Non-numeric text falls back to the floor, never NaN');
assert(findRegion('Không có tỉnh này').label === 'Tokyo', 'An unknown region falls back to Tokyo');

// 4. End-to-end: 30 man, 2 months bonus, Tokyo, no dependents
console.log('\n--- GROUP 4: REFERENCE CASE (30 man · bonus 2 · Tokyo · 0 dependents) ---');
const base = calculateNetSalary({
  man: DEFAULT_SALARY_MAN,
  bonusMonths: 2,
  dependents: 0,
  region: 'Tokyo',
});

assertClose(base.gross, 300_000 * 14, 'Gross is monthly × (12 + bonus months)');
assertClose(base.social, base.gross * (0.0499 + 0.0915 + 0.006), 'Social insurance uses the Tokyo health rate');
assert(base.net < base.gross, 'Net is always below gross');
assert(base.deductionRate > 0.15 && base.deductionRate < 0.35, 'Deduction rate lands in the expected 15–35% band');
assertClose(
  base.net,
  base.gross - base.social - base.incomeTax - base.residentTax,
  'Net equals gross minus every deduction'
);
assertClose(
  base.totalDeduction,
  base.social + base.incomeTax + base.residentTax,
  'Total deduction is the sum of its three rows'
);

// 5. Inputs move the result in the right direction
console.log('\n--- GROUP 5: INPUT SENSITIVITY ---');
const withDependents = calculateNetSalary({ man: 30, bonusMonths: 2, dependents: 2, region: 'Tokyo' });
assert(withDependents.incomeTax < base.incomeTax, 'Dependents lower income tax');
assert(withDependents.residentTax < base.residentTax, 'Dependents lower resident tax');
assert(withDependents.net > base.net, 'Dependents raise take-home pay');
assert(withDependents.social === base.social, 'Dependents do not change social insurance');

const maxDependents = calculateNetSalary({ man: 30, bonusMonths: 2, dependents: 99, region: 'Tokyo' });
const sixDependents = calculateNetSalary({ man: 30, bonusMonths: 2, dependents: DEPENDENTS_MAX, region: 'Tokyo' });
assertClose(maxDependents.net, sixDependents.net, 'Dependents above 6 are clamped to 6');

const noBonus = calculateNetSalary({ man: 30, bonusMonths: 0, dependents: 0, region: 'Tokyo' });
assert(noBonus.gross < base.gross, 'Dropping the bonus lowers annual gross');
assert(noBonus.net < base.net, 'Dropping the bonus lowers annual net');

const osaka = calculateNetSalary({ man: 30, bonusMonths: 2, dependents: 0, region: 'Osaka' });
assert(osaka.social > base.social, 'Osaka charges more health insurance than Tokyo');
assert(osaka.net < base.net, 'A higher health rate lowers take-home pay');

const other = calculateNetSalary({ man: 30, bonusMonths: 2, dependents: 0, region: 'Khác' });
assert(other.social < base.social, '"Khác" uses the lowest health rate of the four');

const higher = calculateNetSalary({ man: 60, bonusMonths: 2, dependents: 0, region: 'Tokyo' });
assert(higher.net > base.net, 'A higher salary raises take-home pay');
assert(
  higher.deductionRate > base.deductionRate,
  'A higher salary is taxed at a higher effective rate (progressivity)'
);

const lowIncome = calculateNetSalary({ man: SALARY_MAN_MIN, bonusMonths: 0, dependents: 6, region: 'Tokyo' });
assert(lowIncome.incomeTax === 0, 'Deductions larger than income leave no income tax, never a negative one');
assert(lowIncome.residentTax >= 5000, 'Resident tax keeps its flat per-capita levy');

// 6. Every option listed in the UI is calculable
console.log('\n--- GROUP 6: EVERY UI OPTION RESOLVES ---');
for (const region of REGIONS) {
  for (const bonus of BONUS_OPTIONS) {
    const result = calculateNetSalary({
      man: 30,
      bonusMonths: bonus.months,
      dependents: 0,
      region: region.label,
    });
    assert(
      Number.isFinite(result.net) && result.net > 0,
      `${region.label} + "${bonus.label}" produces a finite, positive net`
    );
  }
}

// 6b. The nine reference cases CLAUDE_CODE_TASKS.md Task 6 asks for.
// Pinned values, so a change to any bracket, rate or deduction shows up here
// as a concrete yen difference rather than as a silently different answer.
console.log('\n--- GROUP 6b: 25/30/40 MAN × 0/1/2 DEPENDANTS (bonus 2, Tokyo) ---');
const REFERENCE_CASES = [
  { man: 25, dependents: 0, net: 2766542, incomeTax: 70148, residentTax: 147410 },
  { man: 25, dependents: 1, net: 2818941, incomeTax: 50749, residentTax: 114410 },
  { man: 25, dependents: 2, net: 2871340, incomeTax: 31350, residentTax: 81410 },
  { man: 30, dependents: 0, net: 3295870, incomeTax: 92958, residentTax: 192092 },
  { man: 30, dependents: 1, net: 3348269, incomeTax: 73559, residentTax: 159092 },
  { man: 30, dependents: 2, net: 3400668, incomeTax: 54160, residentTax: 126092 },
  { man: 40, dependents: 0, net: 4311453, incomeTax: 179651, residentTax: 283456 },
  { man: 40, dependents: 1, net: 4383251, incomeTax: 140853, residentTax: 250456 },
  { man: 40, dependents: 2, net: 4455049, incomeTax: 102055, residentTax: 217456 },
];

for (const expected of REFERENCE_CASES) {
  const actual = calculateNetSalary({
    man: expected.man,
    bonusMonths: 2,
    dependents: expected.dependents,
    region: 'Tokyo',
  });
  const label = `${expected.man} man × ${expected.dependents} người phụ thuộc`;
  assertClose(Math.round(actual.net), expected.net, `${label}: thực nhận năm`, 1);
  assertClose(Math.round(actual.incomeTax), expected.incomeTax, `${label}: thuế thu nhập`, 1);
  assertClose(Math.round(actual.residentTax), expected.residentTax, `${label}: thuế thị dân`, 1);
}

// 7. Presentation helpers
console.log('\n--- GROUP 7: PRESENTATION ---');
const rows = buildDeductionRows(base);
assert(rows.length === 3, 'Three deduction rows are rendered');
assert(
  rows.every((row) => row.percent >= 0 && row.percent <= 100),
  'Every bar width stays within 0–100%'
);
assertClose(
  rows.reduce((sum, row) => sum + row.amount, 0) * 12,
  base.totalDeduction,
  'The three rows add back up to the yearly total'
);
assert(formatYen(1234567.4) === '1.234.567 ¥', 'Yen is formatted vi-VN and rounded to whole yen');
assert(formatYen(0) === '0 ¥', 'Zero formats cleanly');

const emptyBars = buildDeductionRows({ gross: 0, social: 0, incomeTax: 0, residentTax: 0 });
assert(
  emptyBars.every((row) => row.percent === 0),
  'A zero gross does not divide by zero'
);

console.log('\n========================================================');
console.log(`TOTAL NET SALARY TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
}
console.log('🎉 ALL NET SALARY TESTS PASSED!\n');
process.exit(0);

import React, { useState } from 'react';
import './NetSalaryCalculator.css';
import {
  BONUS_OPTIONS,
  DEFAULT_SALARY_MAN,
  DEPENDENTS_MAX,
  DEPENDENTS_MIN,
  REGIONS,
  SALARY_MAN_MAX,
  SALARY_MAN_MIN,
  SALARY_SLIDER_MAX,
  SALARY_SLIDER_MIN,
  buildDeductionRows,
  calculateNetSalary,
  formatYen,
} from '../../services/toolCalculators/netSalary';

/**
 * "Tính lương thực nhận" — the form and result columns of /tools/luong-thuc-nhan.
 *
 * Everything recalculates on every keystroke (no debounce, per handoff §7) and
 * nothing leaves the component: no fetch, no storage, no URL parameters.
 *
 * `man` is held as the raw input string so the field can be cleared while
 * typing; the calculator clamps it, and the slider reads the clamped value.
 */
export function NetSalaryCalculator({ disclaimer }) {
  const [man, setMan] = useState(String(DEFAULT_SALARY_MAN));
  const [bonusMonths, setBonusMonths] = useState(2);
  const [dependents, setDependents] = useState(0);
  const [region, setRegion] = useState(REGIONS[0].label);

  const result = calculateNetSalary({ man, bonusMonths, dependents, region });
  const rows = buildDeductionRows(result);
  const perMonth = (yearly) => yearly / 12;

  const sliderValue = Math.min(
    SALARY_SLIDER_MAX,
    Math.max(SALARY_SLIDER_MIN, Number(man) || SALARY_SLIDER_MIN)
  );

  return (
    <div className="calc-columns">
      {/* ---------------------------------------------------------------- form */}
      <div className="calc-form-card">
        <h2 className="calc-card-title">Thông tin của bạn</h2>

        <label className="calc-label" htmlFor="calc-salary">
          Lương trước thuế mỗi tháng
        </label>
        <div className="calc-salary-field">
          <input
            id="calc-salary"
            type="number"
            inputMode="numeric"
            min={SALARY_MAN_MIN}
            max={SALARY_MAN_MAX}
            step="1"
            className="calc-salary-input"
            aria-label="Lương tháng theo man yên"
            value={man}
            onChange={(e) => setMan(e.target.value)}
          />
          <span className="calc-salary-unit">man / tháng</span>
        </div>
        <input
          type="range"
          className="calc-salary-range"
          min={SALARY_SLIDER_MIN}
          max={SALARY_SLIDER_MAX}
          step="1"
          aria-label="Kéo để chọn mức lương"
          value={sliderValue}
          onChange={(e) => setMan(e.target.value)}
        />

        <span className="calc-label" id="calc-bonus-label">
          Thưởng (bonus) trong năm
        </span>
        <div className="calc-option-row" role="group" aria-labelledby="calc-bonus-label">
          {BONUS_OPTIONS.map((option) => (
            <button
              key={option.months}
              type="button"
              className={`calc-option ${bonusMonths === option.months ? 'active' : ''}`}
              aria-pressed={bonusMonths === option.months}
              onClick={() => setBonusMonths(option.months)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <span className="calc-label" id="calc-deps-label">
          Số người phụ thuộc
        </span>
        <div className="calc-stepper" role="group" aria-labelledby="calc-deps-label">
          <button
            type="button"
            className="calc-stepper-btn"
            aria-label="Giảm số người phụ thuộc"
            onClick={() => setDependents((n) => Math.max(DEPENDENTS_MIN, n - 1))}
            disabled={dependents <= DEPENDENTS_MIN}
          >
            −
          </button>
          <output className="calc-stepper-value" aria-live="polite">
            {dependents}
          </output>
          <button
            type="button"
            className="calc-stepper-btn"
            aria-label="Tăng số người phụ thuộc"
            onClick={() => setDependents((n) => Math.min(DEPENDENTS_MAX, n + 1))}
            disabled={dependents >= DEPENDENTS_MAX}
          >
            +
          </button>
          <span className="calc-stepper-hint">
            Vợ/chồng, con hoặc người thân bạn đang nuôi
          </span>
        </div>

        <span className="calc-label" id="calc-region-label">
          Khu vực làm việc
        </span>
        <div className="calc-option-row" role="group" aria-labelledby="calc-region-label">
          {REGIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              className={`calc-option calc-option-ink ${region === option.label ? 'active' : ''}`}
              aria-pressed={region === option.label}
              onClick={() => setRegion(option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {disclaimer && <p className="calc-disclaimer">{disclaimer}</p>}
      </div>

      {/* -------------------------------------------------------------- result */}
      <div className="calc-result-column">
        <div className="calc-result-card">
          <div className="calc-result-label">Thực nhận mỗi tháng (ước tính)</div>
          <div className="calc-result-value" aria-live="polite">
            {formatYen(perMonth(result.net))}
          </div>
          <div className="calc-result-stats">
            <div>
              <div className="calc-result-stat-label">Thực nhận cả năm</div>
              <div className="calc-result-stat-value">{formatYen(result.net)}</div>
            </div>
            <div>
              <div className="calc-result-stat-label">Tổng thu nhập năm</div>
              <div className="calc-result-stat-value">{formatYen(result.gross)}</div>
            </div>
            <div>
              <div className="calc-result-stat-label">Tỷ lệ bị trừ</div>
              <div className="calc-result-stat-value">
                {(result.deductionRate * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="calc-breakdown-card">
          <h2 className="calc-card-title calc-breakdown-title">Các khoản bị trừ mỗi tháng</h2>
          <p className="calc-breakdown-sub">Tính trên thu nhập cả năm rồi chia đều 12 tháng.</p>

          {rows.map((row) => (
            <div className="calc-row" key={row.key}>
              <div className="calc-row-head">
                <span className="calc-row-label">{row.label}</span>
                <span className="calc-row-amount">{formatYen(row.amount)}</span>
              </div>
              <div className="calc-row-track">
                <div
                  className="calc-row-bar"
                  style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                />
              </div>
              <div className="calc-row-note">{row.note}</div>
            </div>
          ))}

          <div className="calc-total">
            <span className="calc-total-label">Tổng bị trừ</span>
            <span className="calc-total-amount">
              {formatYen(perMonth(result.totalDeduction))} / tháng
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetSalaryCalculator;

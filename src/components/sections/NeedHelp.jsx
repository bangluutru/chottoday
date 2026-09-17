import React from 'react';
import './NeedHelp.css';
import { PROBLEMS_NEED_HELP } from '../../data/problems';
import { ArrowRightIcon } from '../common/Icons';

export function NeedHelp() {
  return (
    <section className="section" id="need-help" aria-labelledby="need-help-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            Tình huống phổ biến
          </div>
          <h2 id="need-help-heading" className="text-h2">
            Có thể bạn đang cần
          </h2>
          <p className="text-body">
            Các câu hỏi và tình huống cấp thiết thường gặp nhất khi sống tại Nhật Bản.
          </p>
        </div>

        {/* 6 Problem Cards Grid */}
        <div className="problem-grid">
          {PROBLEMS_NEED_HELP.map((item) => (
            <div
              key={item.id}
              className={`chotto-card card-${item.categoryKey} problem-card`}
            >
              <div className="problem-card-badge-row">
                <span className={`chotto-chip chip-${item.categoryKey}`}>
                  {item.tag}
                </span>
              </div>

              <h3 className="problem-card-question">
                {item.question}
              </h3>

              <a
                href="#articles"
                className="text-button problem-card-action"
                aria-label={`Xem giải pháp cho: ${item.question}`}
              >
                <span>{item.linkText}</span>
                <ArrowRightIcon size={14} className="icon-inline-right" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

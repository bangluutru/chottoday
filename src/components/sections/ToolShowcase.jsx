import React from 'react';
import './ToolShowcase.css';
import { getToolsByIds, buildToolUrl } from '../../services/toolRegistry';
import { ToolCard } from '../cards/ToolCard';
import { ExternalLinkIcon } from '../common/Icons';
import { TOOLIO_BASE_URL } from '../../config/constants';

// Homepage decides which tool IDs to feature for discovery
export const FEATURED_TOOL_IDS = [
  'japan-tax-simulator',
  'id-photo-studio',
  'pdf-toolkit',
  'social-insurance-jp',
];

export function ToolShowcase() {
  const featuredTools = getToolsByIds(FEATURED_TOOL_IDS);

  return (
    <section className="section" id="tools" aria-labelledby="tools-heading">
      <div className="container">
        {/* Section Header */}
        <div className="tool-showcase-header">
          <div>
            <div className="section-eyebrow">
              Công cụ tiện ích
            </div>
            <h2 id="tools-heading" className="text-h2">
              Một chút công cụ
            </h2>
            <p className="text-body">
              Các miniapp độc lập trên nền tảng Toolio giúp bạn tính toán, tạo biểu mẫu và xử lý tác vụ tại chỗ.
            </p>
          </div>

          <a
            href={TOOLIO_BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm"
          >
            <span>Khám phá toàn bộ công cụ</span>
            <ExternalLinkIcon size={14} className="icon-inline-right" />
          </a>
        </div>

        {/* Informative ecosystem notice (Decoupled architecture) */}
        <div className="tool-notice-box">
          <div className="text-body">
            <strong>Nguyên tắc Chotto:</strong> Nội dung là điểm bắt đầu, công cụ là điểm kết thúc. Các công cụ xử lý dữ liệu ngay trên trình duyệt của bạn, bảo mật tuyệt đối.
          </div>
          <span className="chotto-chip tool-notice-badge">
            tools.chottoday.com
          </span>
        </div>

        {/* 4 Selected Miniapps Grid */}
        <div className="tool-grid">
          {featuredTools.map((tool) => {
            const toolUrl = buildToolUrl(tool.id, { source: 'homepage' });
            if (!toolUrl) return null;
            return (
              <div key={tool.id} className="tool-grid-item">
                <ToolCard
                  title={tool.name}
                  description={tool.description}
                  category={tool.domain === 'japan-life' ? 'Đời sống Nhật' : 'Tiện ích'}
                  categoryKey="tool"
                  badge={tool.processing === 'browser' ? 'Chạy trên trình duyệt' : 'Xử lý an toàn'}
                  stats={tool.domain === 'japan-life' ? 'Nhật Bản' : 'Đa năng'}
                  toolioPath={toolUrl}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

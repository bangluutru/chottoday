import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="section">
      <div className="container" style={{ textAlign: 'center', padding: '72px 0' }}>
        <div className="section-eyebrow" style={{ color: 'var(--cat-health-text)' }}>
          404 — Không tìm thấy trang
        </div>
        <h1 className="text-h1" style={{ marginBottom: '16px' }}>
          Trang bạn tìm không tồn tại
        </h1>
        <p className="text-body" style={{ maxWidth: '520px', margin: '0 auto 28px' }}>
          Đường dẫn có thể bị sai, bài viết đã được cập nhật sang địa chỉ mới, hoặc tính năng đang được hoàn thiện.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/" className="btn-primary">
            <span>Về Trang chủ</span>
          </Link>
          <Link to="/articles" className="btn-secondary">
            <span>Xem danh sách bài viết</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

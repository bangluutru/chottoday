import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';
import { PageMeta } from '../components/common/PageMeta';

export function NotFoundPage() {
  return (
    <div className="section">
      <PageMeta
        title="404 — Không tìm thấy trang"
        description="Đường dẫn có thể bị sai, bài viết đã được cập nhật sang địa chỉ mới, hoặc tính năng đang được hoàn thiện."
      />
      <div className="container not-found-container">
        <div className="section-eyebrow not-found-eyebrow">
          404 — Không tìm thấy trang
        </div>
        <h1 className="text-h1 not-found-title">
          Trang bạn tìm không tồn tại
        </h1>
        <p className="text-body not-found-desc">
          Đường dẫn có thể bị sai, bài viết đã được cập nhật sang địa chỉ mới, hoặc tính năng đang được hoàn thiện.
        </p>
        <div className="not-found-actions">
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

export default NotFoundPage;

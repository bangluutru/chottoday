import React from 'react';
import './PolicyPage.css';
import { PageMeta } from '../components/common/PageMeta';

/** Shell — filled in by Task 5. */
export function PolicyPage() {
  return (
    <div className="policy-page">
      <PageMeta
        title="Chính sách & Điều khoản"
        description="Chotto thu thập những gì, dữ liệu bạn nhập vào công cụ đi đâu, cookie, quyền của bạn, và điều khoản sử dụng nội dung trên chottoday.com."
        canonical="/policy"
      />
      <div className="container">
        <h1 className="text-h1">Chính sách &amp; Điều khoản</h1>
      </div>
    </div>
  );
}

export default PolicyPage;

import React from 'react';
import './TopicsIndexPage.css';
import { PageMeta } from '../components/common/PageMeta';

/** Shell — filled in by Task 4. */
export function TopicsIndexPage() {
  return (
    <div className="topics-page">
      <PageMeta
        title="Khám phá theo chủ đề"
        description="Bảy chủ đề đời sống tại Nhật: mới sang, thủ tục giấy tờ, tiền và thuế, công việc, gia đình, sức khoẻ và cuộc sống thường ngày."
        canonical="/topics"
      />
      <div className="container">
        <h1 className="text-h1">Khám phá theo chủ đề</h1>
      </div>
    </div>
  );
}

export default TopicsIndexPage;

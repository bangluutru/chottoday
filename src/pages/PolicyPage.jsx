import React from 'react';
import { Link } from 'react-router-dom';
import './PolicyPage.css';
import { PageMeta } from '../components/common/PageMeta';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ArrowRightIcon } from '../components/common/Icons';
import { CONTACT_EMAIL, POLICY_UPDATED_AT } from '../config/constants';
import { formatDate } from '../utils/formatDate';

/**
 * The table of contents, and the only list of anchors on the page: the
 * headings below read their ids from here, so a renamed section cannot leave
 * the sidebar pointing at nothing.
 */
const SECTIONS = [
  { id: 'bao-mat', label: '1. Chính sách bảo mật', level: 1 },
  { id: 'du-lieu', label: '1.1 Dữ liệu Chotto thu thập', level: 2 },
  { id: 'cong-cu', label: '1.2 Dữ liệu bạn nhập vào công cụ', level: 2 },
  { id: 'cookie', label: '1.3 Cookie & đo lường', level: 2 },
  { id: 'quyen', label: '1.4 Quyền của bạn', level: 2 },
  { id: 'dieu-khoan', label: '2. Điều khoản sử dụng', level: 1 },
  { id: 'tham-khao', label: '2.1 Nội dung mang tính tham khảo', level: 2 },
  { id: 'ban-quyen', label: '2.2 Bản quyền & trích dẫn', level: 2 },
  { id: 'thay-doi', label: '2.3 Thay đổi & liên hệ', level: 2 },
];

const heading = (id) => SECTIONS.find((s) => s.id === id).label;

export function PolicyPage() {
  return (
    <div className="policy-page">
      <PageMeta
        title="Chính sách & Điều khoản"
        description="Chotto thu thập gì, dữ liệu bạn nhập vào công cụ đi đâu, cookie, quyền của bạn, và điều khoản sử dụng nội dung trên chottoday.com."
        canonical="/policy"
      />

      <div className="container policy-breadcrumb-row">
        <Breadcrumb
          label="Đường dẫn chính sách"
          items={[{ label: 'Trang chủ', to: '/' }, { label: 'Chính sách & Điều khoản' }]}
        />
      </div>

      {/* HEADER */}
      <section className="policy-head-section">
        <div className="container policy-head">
          <div className="policy-head-main">
            <h1 className="policy-title">
              Chính sách &amp; <span className="policy-title-accent">Điều khoản</span>
            </h1>
            <p className="policy-desc">
              Viết ngắn và rõ như mọi nội dung khác trên Chotto: chúng tôi thu thập gì, dùng
              vào việc gì, và bạn có thể trông đợi điều gì khi dùng trang này.
            </p>
          </div>
          <div className="policy-updated">
            <span className="policy-updated-label">Cập nhật lần cuối</span>
            <span className="policy-updated-date">{formatDate(POLICY_UPDATED_AT)}</span>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="policy-body-section">
        <div className="container policy-body">
          <aside className="policy-toc" aria-label="Mục lục chính sách">
            <h2 className="policy-toc-title">Nội dung</h2>
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`policy-toc-link level-${section.level}`}
              >
                {section.label}
              </a>
            ))}
            <p className="policy-toc-note">
              Bản tiếng Việt là bản chính thức. Nếu có thắc mắc, gửi thư tới{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </aside>

          <div className="policy-content">
            {/* ---------------------------------------------------- privacy */}
            <article className="policy-card" aria-labelledby="bao-mat">
              <span className="policy-part chip-tool">Phần 1</span>
              <h2 id="bao-mat" className="policy-h2">
                Chính sách bảo mật
              </h2>
              <p className="policy-p">
                Chotto là trang thông tin miễn phí, không yêu cầu tạo tài khoản. Nguyên tắc
                của chúng tôi rất đơn giản: thu thập càng ít càng tốt, và không bán dữ liệu
                cho ai.
              </p>

              <h3 id="du-lieu" className="policy-h3">
                {heading('du-lieu')}
              </h3>
              <p className="policy-p">
                Khi bạn đọc trang, hệ thống ghi nhận thông tin kỹ thuật cơ bản: loại thiết
                bị, trình duyệt, trang được xem và thời điểm truy cập. Những dữ liệu này ở
                dạng tổng hợp, dùng để biết nội dung nào hữu ích và trang nào tải chậm.
              </p>
              <p className="policy-p">
                Khi bạn chủ động gửi lời nhắn qua trang <Link to="/about#lien-he">Liên hệ</Link>,
                chúng tôi lưu tên, email (nếu bạn điền) và nội dung tin nhắn — chỉ để trả lời
                bạn và sửa nội dung sai.
              </p>

              <h3 id="cong-cu" className="policy-h3">
                {heading('cong-cu')}
              </h3>
              <div className="policy-callout policy-callout-life">
                <p>
                  Toàn bộ công cụ tính toán (lương, thuế, nenkin, tiền nhà…) chạy ngay trên
                  máy của bạn. Các con số bạn nhập <strong>không được gửi lên máy chủ</strong>,
                  không được lưu và sẽ mất khi bạn đóng tab.
                </p>
              </div>

              <h3 id="cookie" className="policy-h3">
                {heading('cookie')}
              </h3>
              <p className="policy-p">Chotto dùng hai loại lưu trữ trên thiết bị của bạn:</p>
              <div className="policy-bullets">
                <div className="policy-bullet">
                  <span className="policy-dot policy-dot-life" aria-hidden="true" />
                  <span>
                    <strong>Cần thiết:</strong> ghi nhớ ngôn ngữ bạn chọn (VI/JA/EN) và trạng
                    thái hiển thị. Không thể tắt vì trang cần để hoạt động đúng.
                  </span>
                </div>
                <div className="policy-bullet">
                  <span className="policy-dot policy-dot-work" aria-hidden="true" />
                  <span>
                    <strong>Đo lường ẩn danh:</strong> đếm lượt xem theo trang, không gắn với
                    danh tính và không dùng cho quảng cáo. Bạn có thể từ chối trong bảng chọn
                    cookie ở lần truy cập đầu.
                  </span>
                </div>
              </div>

              <h3 id="quyen" className="policy-h3">
                {heading('quyen')}
              </h3>
              <p className="policy-p">
                Bạn có thể yêu cầu xem, sửa hoặc xoá dữ liệu mình đã gửi cho Chotto bất cứ
                lúc nào. Chỉ cần gửi thư tới{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  <strong>{CONTACT_EMAIL}</strong>
                </a>{' '}
                — chúng tôi xử lý trong vòng 14 ngày. Chotto không chuyển dữ liệu cho bên thứ
                ba để tiếp thị, và không dùng dữ liệu của bạn để huấn luyện bất kỳ hệ thống
                nào.
              </p>
            </article>

            {/* ------------------------------------------------------ terms */}
            <article className="policy-card" aria-labelledby="dieu-khoan">
              <span className="policy-part chip-study">Phần 2</span>
              <h2 id="dieu-khoan" className="policy-h2">
                Điều khoản sử dụng
              </h2>
              <p className="policy-p">
                Khi đọc và dùng công cụ trên Chotto, bạn đồng ý với những điều dưới đây. Nếu
                có phần nào bạn thấy chưa hợp lý, hãy nói với chúng tôi.
              </p>

              <h3 id="tham-khao" className="policy-h3">
                {heading('tham-khao')}
              </h3>
              <p className="policy-p">
                Chotto tổng hợp thông tin từ trang chính thức của cơ quan Nhật Bản và kinh
                nghiệm thực tế của cộng đồng. Quy định ở Nhật thay đổi theo năm và theo từng
                địa phương, nên kết quả từ công cụ chỉ là <strong>ước tính</strong>.
              </p>
              <div className="policy-callout policy-callout-work">
                <p>
                  Với các quyết định quan trọng — hồ sơ visa, khai thuế, tranh chấp lao động,
                  y tế — hãy xác nhận lại với cơ quan hành chính, luật sư, kế toán thuế hoặc
                  bác sĩ. Chotto không chịu trách nhiệm cho thiệt hại phát sinh từ việc dùng
                  thông tin trên trang mà không kiểm tra lại.
                </p>
              </div>

              <h3 id="ban-quyen" className="policy-h3">
                {heading('ban-quyen')}
              </h3>
              <p className="policy-p">
                Bài viết, hình minh hoạ và công cụ trên Chotto thuộc về ChottoDay. Bạn được
                chia sẻ tự do cho mục đích cá nhân và cộng đồng, kèm ghi nguồn và đường dẫn
                tới bài gốc.
              </p>
              <p className="policy-p">
                Không sao chép toàn bộ nội dung để đăng lại trên trang khác, không dùng cho
                mục đích thương mại và không thu thập tự động (scraping) khi chưa có sự đồng
                ý bằng văn bản.
              </p>

              <h3 id="thay-doi" className="policy-h3">
                {heading('thay-doi')}
              </h3>
              <p className="policy-p">
                Chotto có thể cập nhật chính sách và điều khoản khi dịch vụ thay đổi. Ngày
                cập nhật luôn được ghi ở đầu trang; những thay đổi lớn sẽ được thông báo trên
                Fanpage. Nếu bạn cần bản lưu của phiên bản trước, cứ viết thư cho chúng tôi.
              </p>

              <div className="policy-cta">
                <p className="policy-cta-note">
                  Có điều gì chưa rõ
                  <br />
                  trong trang này?
                </p>
                <Link to="/about#lien-he" className="policy-cta-btn">
                  Hỏi Chotto
                  <ArrowRightIcon size={15} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PolicyPage;

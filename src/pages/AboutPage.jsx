import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AboutPage.css';
import { PageMeta } from '../components/common/PageMeta';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { ArrowRightIcon, FacebookIcon } from '../components/common/Icons';
import { CONTACT_EMAIL, CONTACT_ENDPOINT, FANPAGE_URL } from '../config/constants';
import { getPublishedArticles } from '../content/articles';
import { getAllCategories } from '../content/categories/categoryMap';
import { TOOL_CATALOGUE } from '../data/tools.js';

const MESSAGE_KINDS = ['Góp ý nội dung', 'Đề xuất công cụ', 'Câu hỏi', 'Hợp tác'];

const VALUES = [
  {
    tint: 'life',
    icon: '/icons/icon-study.svg',
    title: 'Dễ hiểu trước đã',
    body: 'Mọi hướng dẫn đều viết theo thứ tự việc cần làm, kèm tên giấy tờ bằng tiếng Nhật để bạn mang đi đối chiếu ở quầy.',
  },
  {
    tint: 'tool',
    icon: '/icons/icon-tool.svg',
    title: 'Có con số để quyết định',
    body: 'Các công cụ tính lương, thuế, nenkin, tiền nhà đều chạy ngay trên máy bạn — miễn phí và không lưu dữ liệu.',
  },
  {
    tint: 'health',
    icon: '/icons/icon-life.svg',
    title: 'Cập nhật theo phản hồi',
    body: 'Quy định ở Nhật thay đổi thường xuyên. Mỗi góp ý của bạn giúp Chotto sửa lại nội dung cho đúng thực tế hơn.',
  },
];

const FAQS = [
  {
    q: 'Chotto có thu phí không?',
    a: 'Không. Toàn bộ bài viết và công cụ đều miễn phí, không cần tạo tài khoản.',
  },
  {
    q: 'Tôi muốn viết bài cho Chotto?',
    a: 'Rất hoan nghênh. Chọn mục “Hợp tác” trong form và kể ngắn gọn về chủ đề bạn muốn viết cùng kinh nghiệm của bạn ở Nhật.',
  },
  {
    q: 'Thông tin ở đây cập nhật đến khi nào?',
    a: 'Mỗi bài viết đều ghi ngày cập nhật gần nhất. Với quy định thay đổi theo năm như thuế hay bảo hiểm, Chotto kiểm tra lại mỗi đầu năm tài chính.',
  },
  {
    q: 'Tôi thấy một thông tin sai, báo ở đâu?',
    a: 'Gửi qua form với mục “Góp ý nội dung” và kèm đường dẫn bài viết. Nội dung sai sẽ được sửa hoặc tạm ẩn ngay khi kiểm tra xong.',
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AboutPage() {
  const location = useLocation();
  const contactRef = useRef(null);

  // A suggestion handed over from another page (the topic box on /topics/*)
  // arrives as router state and prefills the form rather than being posted from
  // there.
  const handoff = location.state || {};
  const [kind, setKind] = useState(
    MESSAGE_KINDS.includes(handoff.contactKind) ? handoff.contactKind : MESSAGE_KINDS[0]
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    typeof handoff.contactMessage === 'string' ? handoff.contactMessage : ''
  );
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  // Counts come from the content layer, never from a hand-typed number.
  const stats = useMemo(
    () => ({
      articles: getPublishedArticles().length,
      tools: TOOL_CATALOGUE.length,
      topics: getAllCategories().length,
    }),
    []
  );

  // React Router does not scroll to a hash on its own.
  useEffect(() => {
    if (location.hash === '#lien-he' && contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const touch = (setter) => (event) => {
    setter(event.target.value);
    if (status === 'sent' || status === 'error') {
      setStatus('idle');
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      setStatus('error');
      setError('Bạn chưa viết nội dung lời nhắn.');
      return;
    }
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setStatus('error');
      setError('Email chưa đúng định dạng. Bạn có thể bỏ trống nếu không cần trả lời.');
      return;
    }
    if (!CONTACT_ENDPOINT) {
      setStatus('error');
      setError(
        `Form liên hệ chưa được kết nối. Trong lúc chờ, bạn gửi giúp Chotto qua ${CONTACT_EMAIL} nhé.`
      );
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setStatus('error');
      setError(`Chưa gửi được lời nhắn. Bạn thử lại, hoặc viết thẳng tới ${CONTACT_EMAIL} nhé.`);
    }
  };

  const sendLabel =
    status === 'sending' ? 'Đang gửi…' : status === 'sent' ? 'Đã gửi ✓' : 'Gửi lời nhắn';

  return (
    <div className="about-page">
      <PageMeta
        title="Về Chotto"
        description="Chotto tập hợp thông tin, hướng dẫn và công cụ nhỏ dành cho người Việt sống tại Nhật — viết lại bằng tiếng Việt, ngắn gọn và dễ làm theo."
        canonical="/about"
      />

      {/* HERO */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero">
            <img
              src="/images/community/fuji-sakura.jpg"
              alt=""
              className="about-hero-photo"
            />
            <div className="about-hero-scrim" aria-hidden="true" />
            <div className="about-hero-content">
              <span className="chotto-chip chip-health about-hero-badge">Về Chotto</span>
              <h1 className="about-hero-title">
                Một chút hữu ích,
                <br />
                gửi tới người Việt <span className="about-hero-accent">ở Nhật</span>
              </h1>
              <p className="about-hero-desc">
                Chotto là nơi tập hợp những thông tin, hướng dẫn và công cụ nhỏ mà chúng
                tôi từng phải tự mò mẫm khi mới sang Nhật — viết lại bằng tiếng Việt, ngắn
                gọn và dễ làm theo.
              </p>
              <div className="about-hero-actions">
                <a href="#lien-he" className="about-btn-primary">
                  Liên hệ với Chotto
                  <ArrowRightIcon size={15} />
                </a>
                <Link to="/tools" className="about-btn-secondary">
                  Xem công cụ
                </Link>
              </div>
            </div>
            <p className="about-hero-note">
              Làm bởi những người
              <br />
              cũng từng bỡ ngỡ ☺
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values-section">
        <div className="container">
          <div className="about-values">
            {VALUES.map((value) => (
              <div className="about-value-card" key={value.title}>
                <span className={`about-value-icon head-icon-${value.tint}`}>
                  <img src={value.icon} alt="" width="26" height="26" />
                </span>
                <h2 className="about-value-title">{value.title}</h2>
                <p className="about-value-body">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="about-story-section">
        <div className="container">
          <div className="about-story">
            <div className="about-story-main">
              <h2 className="about-story-title">Chotto bắt đầu từ một tờ giấy nhớ</h2>
              <p className="about-story-text">
                Những ngày đầu ở Nhật, chúng tôi ghi lại mọi thứ vào giấy nhớ: mang gì đi
                làm thẻ cư trú, nói câu gì ở phòng khám, lương 30 man thì còn lại bao
                nhiêu. Mỗi lần có người mới sang hỏi, lại phải kể lại từ đầu.
              </p>
              <p className="about-story-text">
                Chotto ra đời để những ghi chú đó không nằm rải rác nữa: một chỗ để tra,
                một chỗ để tính, bằng tiếng Việt. Cái tên lấy từ chữ「ちょっと」— một chút.
                Chúng tôi không hứa giải quyết mọi việc, chỉ mong mỗi ngày của bạn ở Nhật
                dễ hơn một chút.
              </p>
              <p className="about-story-disclaimer">
                Nội dung trên Chotto mang tính tham khảo, không thay thế tư vấn chính thức
                từ cơ quan hành chính, luật sư hay chuyên gia thuế.
              </p>
            </div>

            <div className="about-story-side">
              <p className="about-story-note">
                Một chút thông tin
                <br />
                là bớt một chút lo!
              </p>
              <div className="about-stats">
                <div className="about-stats-label">Chotto hiện có</div>
                <div className="about-stats-value">
                  {stats.articles} bài hướng dẫn
                  <br />
                  {stats.tools} công cụ tính toán
                  <br />
                  {stats.topics} chủ đề chính
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="about-contact-section" id="lien-he" ref={contactRef}>
        <div className="container about-contact">
          <form className="about-form-card" onSubmit={handleSubmit} noValidate>
            <h2 className="about-form-title">Gửi lời nhắn cho Chotto</h2>
            <p className="about-form-sub">
              Góp ý nội dung, đề xuất công cụ, hay chỉ đơn giản là một câu hỏi — đều được
              chào đón.
            </p>

            <div
              className="about-kind-row"
              role="group"
              aria-label="Loại lời nhắn"
            >
              {MESSAGE_KINDS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className={`about-kind ${kind === label ? 'active' : ''}`}
                  aria-pressed={kind === label}
                  onClick={() => setKind(label)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="about-field-grid">
              <div>
                <label className="about-label" htmlFor="contact-name">
                  Tên của bạn
                </label>
                <input
                  id="contact-name"
                  type="text"
                  className="about-input"
                  placeholder="Ví dụ: Minh"
                  value={name}
                  onChange={touch(setName)}
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="about-label" htmlFor="contact-email">
                  Email (không bắt buộc)
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="about-input"
                  placeholder="de-chotto-tra-loi@email.com"
                  value={email}
                  onChange={touch(setEmail)}
                  autoComplete="email"
                />
              </div>
            </div>

            <label className="about-label" htmlFor="contact-message">
              Nội dung
            </label>
            <textarea
              id="contact-message"
              rows="5"
              className="about-textarea"
              placeholder="Bạn đang gặp khó ở đâu, hoặc muốn Chotto làm thêm công cụ gì?"
              value={message}
              onChange={touch(setMessage)}
              required
              aria-describedby="contact-privacy"
            />

            <div className="about-submit-row">
              <button type="submit" className="about-submit" disabled={status === 'sending'}>
                {sendLabel}
              </button>
              <span className="about-submit-hint" id="contact-privacy">
                Chotto thường trả lời trong 2–3 ngày. Thông tin của bạn không được chia sẻ
                cho bên thứ ba.
              </span>
            </div>

            <div aria-live="polite">
              {status === 'sent' && (
                <p className="about-banner about-banner-ok">
                  Đã nhận được lời nhắn của bạn. Cảm ơn vì đã giúp Chotto tốt hơn một chút!
                </p>
              )}
              {status === 'error' && <p className="about-banner about-banner-error">{error}</p>}
            </div>
          </form>

          <aside className="about-aside" aria-label="Kênh liên hệ khác">
            <div className="about-aside-card about-aside-card-panel">
              <h2 className="about-aside-title">Kênh khác</h2>

              <a
                href={FANPAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="about-channel"
              >
                <span className="about-channel-icon about-channel-fb">
                  <FacebookIcon size={18} color="#ffffff" />
                </span>
                <span className="about-channel-body">
                  <span className="about-channel-title">Fanpage Chotto</span>
                  <span className="about-channel-desc">Hỏi nhanh, trả lời nhanh</span>
                </span>
              </a>

              <a href={`mailto:${CONTACT_EMAIL}`} className="about-channel">
                <span className="about-channel-icon about-channel-mail" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <path d="M3.5 7l8.5 6 8.5-6" />
                  </svg>
                </span>
                <span className="about-channel-body">
                  <span className="about-channel-title">{CONTACT_EMAIL}</span>
                  <span className="about-channel-desc">Hợp tác &amp; báo lỗi nội dung</span>
                </span>
              </a>

              <Link to="/tools" className="about-channel">
                <span className="about-channel-icon head-icon-tool">
                  <img src="/icons/icon-tool.svg" alt="" width="20" height="20" />
                </span>
                <span className="about-channel-body">
                  <span className="about-channel-title">Đề xuất công cụ mới</span>
                  <span className="about-channel-desc">Xem những công cụ đang có</span>
                </span>
              </Link>
            </div>

            <div className="about-aside-card">
              <h2 className="about-aside-title">Câu hỏi thường gặp</h2>
              <FaqAccordion items={FAQS} size="sm" />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;

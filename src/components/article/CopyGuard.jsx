import React, { useCallback, useEffect, useRef, useState } from 'react';
import './CopyGuard.css';
import {
  ATTRIBUTE_ON_COPY,
  BLOCK_CONTEXT_MENU,
  BLOCK_IMAGE_DRAG,
  BLOCK_SELECTION,
  COPY_PROTECTION_ENABLED,
  NOTICE_DURATION,
  buildAttribution,
} from '../../config/contentProtection';

/**
 * Wraps the article body and turns away the casual copy.
 *
 * A reader who tries gets a notice pointing them at the share button, which is
 * what they usually wanted anyway; a reader who copies anyway gets the title
 * and the link on their clipboard instead of the text. See
 * src/config/contentProtection.js for what this can and cannot do.
 *
 * Interactive things keep working: links stay right-clickable so "open in new
 * tab" survives, and anything marked data-allow-select stays selectable.
 */
export function CopyGuard({ title, className = '', children }) {
  const [notice, setNotice] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const flashNotice = useCallback(() => {
    setNotice(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNotice(false), NOTICE_DURATION);
  }, []);

  /** True for anything inside the guard that must keep its default behaviour. */
  const isExempt = (target) =>
    !!(target instanceof Element && target.closest('a, button, input, textarea, [data-allow-select]'));

  const handleCopy = (event) => {
    if (!COPY_PROTECTION_ENABLED || !ATTRIBUTE_ON_COPY) return;
    if (isExempt(event.target)) return;

    event.preventDefault();
    const attribution = buildAttribution({
      title,
      url: typeof window !== 'undefined' ? window.location.href : 'https://chottoday.com',
    });

    // Both formats, so a paste into a rich editor and a paste into a plain
    // text field say the same thing.
    event.clipboardData?.setData('text/plain', attribution);
    event.clipboardData?.setData('text/html', attribution.replace(/\n/g, '<br>'));
    flashNotice();
  };

  const handleContextMenu = (event) => {
    if (!COPY_PROTECTION_ENABLED || !BLOCK_CONTEXT_MENU) return;
    if (isExempt(event.target)) return;

    event.preventDefault();
    flashNotice();
  };

  const handleDragStart = (event) => {
    if (!COPY_PROTECTION_ENABLED || !BLOCK_IMAGE_DRAG) return;
    if (event.target instanceof Element && event.target.tagName === 'IMG') {
      event.preventDefault();
    }
  };

  const guarded = COPY_PROTECTION_ENABLED && BLOCK_SELECTION;

  return (
    <div
      className={`${className} copy-guard ${guarded ? 'is-guarded' : ''}`.trim()}
      onCopy={handleCopy}
      onCut={handleCopy}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
    >
      {children}

      {/* Screen readers are unaffected by any of the above, so the notice is
          announced politely rather than as an alert. */}
      <div className={`copy-guard-notice ${notice ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {notice && (
          <>
            <strong>Nội dung thuộc bản quyền ChottoDay.</strong>
            <span>Bạn có thể dùng nút “Copy link” để chia sẻ bài viết nhé ☺</span>
          </>
        )}
      </div>
    </div>
  );
}

export default CopyGuard;

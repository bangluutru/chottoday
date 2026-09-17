import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://chottoday.com';
const DEFAULT_TITLE = 'Chotto — Vấn đề nhỏ, có Chotto giúp một chút.';
const DEFAULT_DESC = 'Thông tin, hướng dẫn và công cụ hữu ích cho người Việt sống tại Nhật Bản. Từ thủ tục hành chính, thuế, việc làm đến cuộc sống thường ngày.';
const DEFAULT_IMAGE = `${SITE_URL}/images/hero-everyday-japan.jpg`;

function setMetaTag(attributeName, attributeValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonicalTag(url) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function PageMeta({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
}) {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = title ? `${title} — ChottoDay` : DEFAULT_TITLE;
    const finalOgTitle = ogTitle || pageTitle;
    const finalOgDesc = ogDescription || description;
    const canonicalUrl = canonical
      ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`)
      : `${SITE_URL}${location.pathname}`;

    const imageUrl = ogImage.startsWith('http')
      ? ogImage
      : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

    // 1. Page Title
    document.title = pageTitle;

    // 2. Canonical
    setCanonicalTag(canonicalUrl);

    // 3. Meta Description
    setMetaTag('name', 'description', description);

    // 4. OpenGraph tags
    setMetaTag('property', 'og:title', finalOgTitle);
    setMetaTag('property', 'og:description', finalOgDesc);
    setMetaTag('property', 'og:image', imageUrl);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);

    // 5. Twitter card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalOgTitle);
    setMetaTag('name', 'twitter:description', finalOgDesc);
    setMetaTag('name', 'twitter:image', imageUrl);
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, location.pathname]);

  return null;
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://chottoday.com';
const DEFAULT_TITLE = 'Chotto — Vấn đề nhỏ, có Chotto giúp một chút.';
const DEFAULT_DESC = 'Thông tin, hướng dẫn và công cụ hữu ích cho người Việt sống tại Nhật Bản. Từ thủ tục hành chính, thuế, việc làm đến cuộc sống thường ngày.';
const DEFAULT_IMAGE = `${SITE_URL}/images/og/og-default.png`;

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

function setStructuredDataTag(data) {
  const SCRIPT_ID = 'chotto-structured-data';
  let script = document.getElementById(SCRIPT_ID);
  if (!data) {
    if (script) script.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function PageMeta({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  robots = 'index, follow',
  structuredData,
}) {
  const location = useLocation();

  useEffect(() => {
    // Title rule (Section 24): {Article Title} | Chotto
    const pageTitle = title ? `${title} | Chotto` : DEFAULT_TITLE;
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

    // 3b. Robots — written on every page so a noindex view (search results)
    // cannot leak onto the next route during client-side navigation.
    setMetaTag('name', 'robots', robots);

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

    // 6. Structured Data
    setStructuredDataTag(structuredData);

    return () => {
      // Clean up structured data on page transition
      setStructuredDataTag(null);
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, robots, structuredData, location.pathname]);

  return null;
}

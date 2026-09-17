/**
 * Grounded Summarizer for Intelligent Discovery
 * 
 * Generates concise, reliable quick summaries strictly extracted from
 * verified content fields (shortAnswer, keyTakeaways, excerpt).
 * 
 * ZERO HALLUCINATIONS:
 * Never synthesizes unverified claims or off-topic foreign legal info.
 */

export function generateGroundedSummary(topArticle, intent) {
  if (!topArticle) return null;

  // Only produce quick summary if confidence is sufficient
  if (intent && intent.confidence < 0.3) {
    return null;
  }

  // 1. Prefer verified shortAnswer block if present
  if (topArticle.shortAnswer) {
    const { lead, steps, note } = topArticle.shortAnswer;
    return {
      type: 'grounded',
      headline: lead || `Tóm tắt nhanh về ${topArticle.title}:`,
      keyPoints: Array.isArray(steps) ? steps.slice(0, 3) : [],
      note: note || null,
      sourceArticle: {
        title: topArticle.title,
        slug: topArticle.slug,
      },
    };
  }

  // 2. Otherwise prefer keyTakeaways
  if (Array.isArray(topArticle.keyTakeaways) && topArticle.keyTakeaways.length > 0) {
    return {
      type: 'grounded',
      headline: `Tóm tắt nhanh về ${topArticle.title}:`,
      keyPoints: topArticle.keyTakeaways.slice(0, 3),
      note: null,
      sourceArticle: {
        title: topArticle.title,
        slug: topArticle.slug,
      },
    };
  }

  // 3. Fallback to verified excerpt
  if (topArticle.excerpt) {
    return {
      type: 'grounded',
      headline: `Về ${topArticle.title}:`,
      keyPoints: [topArticle.excerpt],
      note: null,
      sourceArticle: {
        title: topArticle.title,
        slug: topArticle.slug,
      },
    };
  }

  return null;
}

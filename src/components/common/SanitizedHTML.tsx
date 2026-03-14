import DOMPurify from 'dompurify';
import { useMemo } from 'react';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * A component that safely renders HTML content by sanitizing it using DOMPurify.
 * This mitigates Cross-Site Scripting (XSS) vulnerabilities.
 */
const SanitizedHTML = ({ html, className = '' }: SanitizedHTMLProps) => {
  const sanitizedHTML = useMemo(() => {
    return DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true }, // allow standard HTML
      FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onload', 'onmouseover', 'onmouseout'], // basic event handlers
    });
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

export default SanitizedHTML;

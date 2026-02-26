import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * A security-focused component that renders HTML content safely.
 * It uses DOMPurify to strip out any XSS vectors before rendering.
 *
 * Use this instead of dangerouslySetInnerHTML directly.
 */
const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, className }) => {
  const sanitizedContent = useMemo(() => ({
    __html: DOMPurify.sanitize(html)
  }), [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={sanitizedContent}
    />
  );
};

export default SanitizedHTML;

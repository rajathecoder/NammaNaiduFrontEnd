import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

/**
 * A wrapper component that safely renders HTML content by sanitizing it first.
 * Prevents Cross-Site Scripting (XSS) vulnerabilities.
 */
const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, ...rest }) => {
  const sanitizedContent = DOMPurify.sanitize(html);

  return (
    <div
      {...rest}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SanitizedHTML;

import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

/**
 * A reusable component to safely render HTML content by sanitizing it first.
 * This prevents Cross-Site Scripting (XSS) vulnerabilities.
 */
export const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, ...props }) => {
  // Sanitize the HTML string using DOMPurify
  const sanitizedContent = DOMPurify.sanitize(html);

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SanitizedHTML;

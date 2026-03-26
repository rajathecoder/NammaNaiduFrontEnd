import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

/**
 * A security-focused component for rendering sanitized HTML.
 * Uses DOMPurify to strip any malicious scripts or invalid tags from the input HTML
 * before rendering it with dangerouslySetInnerHTML.
 */
const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, className }) => {
  // Sanitize the HTML string to prevent XSS attacks
  const cleanHtml = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default SanitizedHTML;

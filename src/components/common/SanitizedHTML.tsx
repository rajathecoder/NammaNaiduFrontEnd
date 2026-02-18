import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

export const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, className }) => {
  // Configure DOMPurify to allow specific attributes and tags if necessary.
  // By default it strips dangerous tags like <script>.
  // We explicitly allow 'target' for links and 'class' for styling.
  const sanitizedContent = DOMPurify.sanitize(html, {
    ADD_ATTR: ['target', 'class'],
  });

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

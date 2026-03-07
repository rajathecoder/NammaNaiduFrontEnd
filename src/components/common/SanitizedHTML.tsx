import DOMPurify from 'dompurify';
import React from 'react';

interface SanitizedHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, ...props }) => {
  const sanitizedContent = DOMPurify.sanitize(html);

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SanitizedHTML;

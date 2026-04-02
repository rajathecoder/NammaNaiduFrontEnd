import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizedHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, ...props }) => {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SanitizedHTML;

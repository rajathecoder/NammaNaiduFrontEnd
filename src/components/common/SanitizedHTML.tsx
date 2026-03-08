import DOMPurify from 'dompurify';
import React from 'react';

interface SanitizedHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

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

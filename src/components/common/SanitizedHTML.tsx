import DOMPurify from 'dompurify';
import React from 'react';

interface SanitizedHTMLProps extends React.HTMLAttributes<HTMLDivElement> {
  html: string;
}

const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, ...props }) => {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} {...props} />;
};

export default SanitizedHTML;

export function sanitizeHTML(html: string): string {
  if (!html) return '';
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Strip scripts
  const scripts = doc.querySelectorAll('script');
  scripts.forEach(script => script.remove());

  // Strip inline events
  const elements = doc.querySelectorAll('*');
  elements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

const fs = require('fs');

let content = fs.readFileSync('src/utils/sanitize.ts', 'utf8');

// Adjust the regex to ignore tabs (\x09) and newlines (\x0a, \x0d)
content = content.replace(/\\x00-\\x1F/g, '\\x00-\\x08\\x0b\\x0c\\x0e-\\x1f');

// Do not globally remove iframes or style since it breaks CMS functionality
content = content.replace(/'script', 'iframe', 'object', 'embed', 'form', 'style', 'base', 'math', 'svg'/, "'script', 'object', 'embed', 'form', 'base', 'math', 'svg'");

fs.writeFileSync('src/utils/sanitize.ts', content, 'utf8');

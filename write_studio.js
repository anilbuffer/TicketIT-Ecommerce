const fs = require('fs');

const content = fs.readFileSync('studio_template.txt', 'utf8');
fs.writeFileSync('src/components/shop/TemplateCustomizerStudio.tsx', content, 'utf8');
console.log('Written successfully, size:', fs.statSync('src/components/shop/TemplateCustomizerStudio.tsx').size);

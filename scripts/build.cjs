const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js']) fs.copyFileSync(path.join(root, file), path.join(dist, file));
fs.cpSync(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
console.log('Готово: dist');

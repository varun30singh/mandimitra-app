const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.resolve(__dirname, '../frontend/components'),
  path.resolve(__dirname, '../frontend/app')
];

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('.next') && !fullPath.includes('/admin')) {
        results = results.concat(getFiles(fullPath));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = targetDirs.flatMap(getFiles);
console.log(`Auditing ${allFiles.length} files...`);

const findings = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, lineNum) => {
    // Check for <Text ...>...</Text>
    const textTagMatch = line.match(/<Text[^>]*>(.*?)<\/Text>/g);
    if (textTagMatch) {
      textTagMatch.forEach(tag => {
        // extract inner content
        const inner = tag.replace(/<Text[^>]*>/, '').replace(/<\/Text>/, '').trim();
        // Ignore if purely empty, variable like {farmer.name}, {t(...)}, {translate*(...)}, icon, etc.
        if (inner && !inner.startsWith('{t(') && !inner.startsWith('{translate') && !inner.startsWith('{language') && !inner.startsWith('{isProcessing') && !inner.startsWith('{checkingIn')) {
          // Check if contains letters (actual text)
          if (/[a-zA-Z]{2,}/.test(inner)) {
            findings.push({
              file: path.relative(path.resolve(__dirname, '..'), file),
              lineNum: lineNum + 1,
              tag: tag.trim(),
              inner
            });
          }
        }
      });
    }
  });
});

console.log(`Found ${findings.length} potential non-wrapped text items:`);
findings.forEach(f => {
  console.log(`${f.file}:${f.lineNum} -> ${f.tag}`);
});

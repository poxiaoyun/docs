const path = require('path');
const fs = require('fs');
const { migrateFile } = require('./migrate.cjs');

function run() {
  const cn = path.resolve(__dirname, '../src/pages/docs/cn/30.moha');
  const en = path.resolve(__dirname, '../src/pages/docs/en/30.moha');

  [cn, en].forEach(dir => {
    ['08.console', '09.boss'].forEach(sub => fs.mkdirSync(path.join(dir, sub), { recursive: true }));
  });

  [
    ['../../docs-ai/console/moha', path.join(cn, '08.console')],
    ['../../docs-ai/en/console/moha', path.join(en, '08.console')],
    ['../../docs-ai/boss/moha', path.join(cn, '09.boss')],
    ['../../docs-ai/en/boss/moha', path.join(en, '09.boss')]
  ].forEach(([src, dest]) => {
    const s = path.resolve(__dirname, src);
    if (fs.existsSync(s)) {
      fs.readdirSync(s).filter(f => f.endsWith('.md') && f !== 'index.md').forEach(f => migrateFile(path.join(s, f), path.join(dest, f)));
    }
  });
}

run();

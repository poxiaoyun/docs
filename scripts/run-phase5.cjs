const path = require('path');
const fs = require('fs');
const { migrateFile } = require('./migrate.cjs');

function run() {
  const cn = path.resolve(__dirname, '../src/pages/docs/cn/20.boss');
  const en = path.resolve(__dirname, '../src/pages/docs/en/20.boss');

  [cn, en].forEach(dir => {
    ['01.iam', '02.gateway', '03.settings'].forEach(sub => fs.mkdirSync(path.join(dir, sub), { recursive: true }));
  });

  [
    ['../../docs-ai/boss/iam', path.join(cn, '01.iam')],
    ['../../docs-ai/en/boss/iam', path.join(en, '01.iam')],
    ['../../docs-ai/boss/gateway', path.join(cn, '02.gateway')],
    ['../../docs-ai/en/boss/gateway', path.join(en, '02.gateway')],
    ['../../docs-ai/boss/settings', path.join(cn, '03.settings')],
    ['../../docs-ai/en/boss/settings', path.join(en, '03.settings')]
  ].forEach(([src, dest]) => {
    const s = path.resolve(__dirname, src);
    if (fs.existsSync(s)) {
      fs.readdirSync(s).filter(f => f.endsWith('.md') && f !== 'index.md').forEach(f => migrateFile(path.join(s, f), path.join(dest, f)));
    }
  });

  // dashboard.md
  if (fs.existsSync(path.resolve(__dirname, '../../docs-ai/boss/dashboard.md'))) {
    migrateFile(path.resolve(__dirname, '../../docs-ai/boss/dashboard.md'), path.join(cn, 'dashboard.md'));
  }
  if (fs.existsSync(path.resolve(__dirname, '../../docs-ai/en/boss/dashboard.md'))) {
    migrateFile(path.resolve(__dirname, '../../docs-ai/en/boss/dashboard.md'), path.join(en, 'dashboard.md'));
  }
}

run();

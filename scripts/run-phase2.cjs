const { migrateFile } = require('./migrate.cjs');
const fs = require('fs');

const baseSource = '../docs-ai';
const baseDest = './src/pages/docs';

// Phase 2: Guide
migrateFile(`${baseSource}/guide/quick-start.md`, `${baseDest}/cn/02.guide/01.quick-start.md`);
migrateFile(`${baseSource}/guide/architecture.md`, `${baseDest}/cn/02.guide/02.architecture.md`);
migrateFile(`${baseSource}/guide/glossary.md`, `${baseDest}/cn/02.guide/03.glossary.md`);

// Check if english versions exist
if (fs.existsSync(`${baseSource}/en/guide/quick-start.md`)) {
    migrateFile(`${baseSource}/en/guide/quick-start.md`, `${baseDest}/en/02.guide/01.quick-start.md`);
}
if (fs.existsSync(`${baseSource}/en/guide/architecture.md`)) {
    migrateFile(`${baseSource}/en/guide/architecture.md`, `${baseDest}/en/02.guide/02.architecture.md`);
}
if (fs.existsSync(`${baseSource}/en/guide/glossary.md`)) {
    migrateFile(`${baseSource}/en/guide/glossary.md`, `${baseDest}/en/02.guide/03.glossary.md`);
}

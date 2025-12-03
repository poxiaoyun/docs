# Rune Docs

Rune Docs is a modern, high-performance documentation site built with React, Vite, and Material UI. It features automatic navigation generation, internationalization support, and a clean, responsive design.

## Features

- 🚀 **High Performance**: Built on Vite and React 19.
- 📝 **Markdown Support**: Write documentation in standard Markdown with GFM support.
- 🌍 **Internationalization**: Built-in support for multiple languages (English and Chinese).
- 🎨 **Material Design**: Beautiful and accessible UI components based on MUI.
- 🌙 **Dark/Light Mode**: Seamless theme switching.
- 📂 **Auto-generated Navigation**: Navigation menus are automatically generated from the file structure.

## Prerequisites

- Node.js >= 20

## Installation

**Using Yarn (Recommended)**

```sh
yarn install
```

**Using Npm**

```sh
npm install
```

## Development

Start the development server:

```sh
yarn dev
# or
npm run dev
```

Open [http://localhost:8081](http://localhost:8081) to view it in the browser.

## Build

Build for production:

```sh
yarn build
# or
npm run build
```

## Documentation Usage

The documentation content is located in `src/pages/docs`. The site supports multiple languages, with separate directories for each language (e.g., `cn` for Chinese, `en` for English).

### Directory Structure

```
src/pages/docs/
  ├── cn/                  # Chinese documentation
  │   ├── 01.introduction.md
  │   ├── 02.development/  # Grouped section
  │   │   ├── index.md     # Metadata for the folder
  │   │   └── ...
  └── en/                  # English documentation
      ├── 01.introduction.md
      └── ...
```

### Adding New Pages

1.  **Create a File**: Add a `.md` file in the appropriate language directory.
2.  **Naming Convention**: Use a number prefix to control the order (e.g., `01.getting-started.md`). The number will be stripped from the URL.
3.  **Frontmatter**: Add a YAML frontmatter block at the top of the file to define the page title.

```markdown
---
title: Introduction
---

# Welcome to Rune Docs

Your content here...
```

### Creating Groups (Folders)

To group related pages into a section:

1.  Create a folder (e.g., `02.development`).
2.  Inside the folder, create an `index.md` file.
3.  In `index.md`, specify the title for the group using frontmatter.

```markdown
---
title: Development Guide
---
```

_Note: The `index.md` file is only used for folder metadata and does not become a visible page itself._

### Internationalization (i18n)

- Place English files in `src/pages/docs/en/`.
- Place Chinese files in `src/pages/docs/cn/`.
- The system automatically falls back to the default language (Chinese) if a translation is missing.

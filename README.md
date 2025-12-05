# Rune Docs

Rune Docs is a modern, high-performance documentation site built with React, Vite, and Material UI. It features automatic navigation generation, internationalization support, and a clean, responsive design.

## 🎨 New Modern Homepage Design

The homepage has been redesigned with a modern, engaging layout featuring:
- ✨ **Hero Section** with gradient backgrounds and animated product cards
- 🎯 **Capabilities Overview** showcasing three product lines with brand colors
- 🚀 **Quick Start Guide** with step-by-step visual flow
- 💡 **Solutions & Use Cases** with gradient card designs
- 🔧 **Ecosystem Resources** with interactive CTAs
- 👥 **Community Events** with timeline and registration
- 🎉 **Call-to-Action** section with key metrics

See [`HOMEPAGE_DESIGN.md`](./HOMEPAGE_DESIGN.md) for detailed design documentation.

## Features

- 🚀 **High Performance**: Built on Vite and React 19.
- 📝 **Markdown Support**: Write documentation in standard Markdown with GFM support.
- 🌍 **Internationalization**: Built-in support for multiple languages (English and Chinese).
- 🎨 **Material Design**: Beautiful and accessible UI components based on MUI.
- 🌙 **Dark/Light Mode**: Seamless theme switching.
- 📂 **Auto-generated Navigation**: Navigation menus are automatically generated from the file structure.
- 🎬 **Smooth Animations**: Framer Motion powered scroll animations and transitions.

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

Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

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

## Recent Documentation Updates

- `src/pages/docs/toc.tsx` now imports per-product sidebar definitions from `src/pages/docs/cn/*/toc.ts`, which makes each product's navigation easier to maintain.
- The Moha section (`src/pages/docs/cn/30.moha/`) received a full set of placeholder Markdown files aligned with the sidebar links, ensuring the site no longer exposes 404s when users navigate into the Moha tree.
- The Moha home cards were adjusted to remove the redundant cards, update titles (`核心功能`/`SDK 教程`), and apply cold-gradient styling so the landing section matches the current product narrative.

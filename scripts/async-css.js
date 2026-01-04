#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDir = 'dist';

async function makeCSSAsync() {
  try {
    const files = await readdir(distDir);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    for (const file of htmlFiles) {
      const filePath = join(distDir, file);
      let content = await readFile(filePath, 'utf-8');

      // Transform CSS links to load asynchronously
      content = content.replace(
        /<link\s+rel="stylesheet"\s+crossorigin=""\s+href="([^"]+)">/g,
        (match, href) =>
          `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="${href}"></noscript>`,
      );

      await writeFile(filePath, content, 'utf-8');
      console.log(`✓ Made CSS async in ${file}`);
    }

    console.log(`\n✅ Successfully made CSS non-render-blocking in ${htmlFiles.length} files`);
  } catch (error) {
    console.error('Error making CSS async:', error);
    process.exit(1);
  }
}

makeCSSAsync();

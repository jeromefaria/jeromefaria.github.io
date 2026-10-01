import { interFontFaces } from './pdf-fonts.mjs';

export const baseStyles = async root => `
  ${await interFontFaces(root)}
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; font-size: 10pt; margin: 0; }
  h1 { font-size: 20pt; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
  h2 { font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  .tagline { text-transform: uppercase; letter-spacing: 0.12em; font-size: 8pt; color: #666; }
  strong { font-weight: 600; }
  em { font-style: italic; }
`;

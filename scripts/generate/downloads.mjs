import { withBrowser } from '../lib/playwright-render.mjs';
import { render as renderDossier } from './generate-dossier.mjs';
import { render as renderEpkBundle } from './generate-epk-bundle.mjs';
import { render as renderOgCv } from './generate-og-cv.mjs';
import { render as renderOgLive } from './generate-og-live.mjs';
import { render as renderOgNewsletter } from './generate-og-newsletter.mjs';
import { render as renderOgWriting } from './generate-og-writing.mjs';
import { render as renderResume } from './generate-resume.mjs';
import { render as renderTechRider } from './generate-tech-rider.mjs';

const generators = [
  renderEpkBundle,
  renderTechRider,
  renderDossier,
  renderResume,
  renderOgCv,
  renderOgWriting,
  renderOgLive,
  renderOgNewsletter,
];

await withBrowser(async browser => {
  for (const render of generators) await render(browser);
});

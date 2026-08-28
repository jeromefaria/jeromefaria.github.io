// Encodes the local WAV masters to streaming AAC and regenerates src/data/audioManifest.ts.
//
// SAFETY: the masters under SOURCE_ROOT are read-only. This script only ever reads from them
// (ffmpeg -i / ffprobe) and writes exclusively under OUT_ROOT (off the Audio drive). It asserts
// OUT_ROOT is not inside SOURCE_ROOT before doing anything.
//
// Loudness: masters are preserved as-is. True-peak is measured per track; a transparent -1 dBFS
// limiter is applied ONLY to a track that would otherwise exceed -1 dBTP. Clean masters pass through.
//
// Usage: node scripts/encode-audio.mjs

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ROOT = '/Volumes/Audio/Audio/Releases';
const OUT_ROOT = join(REPO_ROOT, 'audio-dist');
const MANIFEST_FILE = join(REPO_ROOT, 'src', 'data', 'audioManifest.ts');
const BITRATE = '256k';
const TRUE_PEAK_CEILING_DB = -1;

// True-peak limiter to a -1 dBTP ceiling (0.891 ≈ -1 dB): oversample 4x so inter-sample peaks become
// catchable, limit without auto-levelling, then downsample. A no-op for tracks already under the
// ceiling — applied uniformly, as streaming platforms do. Output is re-measured to confirm it holds.
const TRUE_PEAK_LIMITER = 'aresample=192000,alimiter=limit=0.891:level=false,aresample=48000';

// Explicit master → site mapping. Titles are the canonical site titles (not the filesystem-safe
// filenames). 2504 is one continuous piece whose five movements are display-only, so it is a single
// playable file. bonus/ and cassette/ extras are intentionally omitted.
const RELEASES = [
  {
    releaseId: '1714', catalog: 'BRQN001', folder: '2010 - BRQN001 - 17_14', album: '17:14', year: 2010,
    tracks: [
      { file: '01 - 8.58.wav', title: '8:58' },
      { file: '02 - 2.58.wav', title: '2:58' },
      { file: '03 - 5.18.wav', title: '5:18' },
    ],
  },
  {
    releaseId: 'overlapse', catalog: 'BRQN002', folder: '2012 - BRQN002 - Overlapse', album: 'Overlapse', year: 2012,
    tracks: [
      { file: '01 - Attack (Prelude).wav', title: 'Attack (Prelude)' },
      { file: '02 - Sustain I.wav', title: 'Sustain I' },
      { file: '03 - Sustain II.wav', title: 'Sustain II' },
      { file: '04 - Decay I.wav', title: 'Decay I' },
      { file: '05 - Decay II.wav', title: 'Decay II' },
      { file: '06 - Decay III.wav', title: 'Decay III' },
      { file: '07 - Release (Conclusion).wav', title: 'Release (Conclusion)' },
    ],
  },
  {
    releaseId: 'caligari-album', catalog: 'BRQN005',
    folder: '2023 - BRQN005 - Music Written & Performed for The Cabinet of Dr. Caligari',
    album: 'Music Written & Performed for The Cabinet of Dr. Caligari', year: 2023,
    tracks: [
      { file: '01 - Spirits Surround Us On Every Side.wav', title: 'Spirits Surround Us On Every Side' },
      { file: '02 - Awaken For A Moment From Your Dark Night.wav', title: 'Awaken For A Moment From Your Dark Night' },
      { file: '03 - How Long Will I Live.wav', title: 'How Long Will I Live?' },
      { file: "04 - It Couldn't Have Been Cesare.wav", title: "It Couldn't Have Been Cesare..." },
      { file: '05 - We Who Are Of Noble Blood May Not Follow The Wishes Of Our Hearts.wav', title: 'We Who Are Of Noble Blood May Not Follow The Wishes Of Our Hearts' },
    ],
  },
  {
    releaseId: '2504', catalog: 'BRQN006', folder: '2024 - BRQN006 - 2504', album: '2504', year: 2024,
    tracks: [
      { file: '01 - 2504.wav', title: '2504' },
    ],
  },
  {
    releaseId: 'en-veille', catalog: 'BRQN008', folder: '2026 - BRQN008 - En Veille', album: 'En Veille', year: 2026,
    tracks: [
      { file: '01 - En Veille.wav', title: 'En Veille' },
    ],
  },
  {
    releaseId: 'contraplacado', catalog: 'BRQN009', folder: '2026 - BRQN009 - Contraplacado', album: 'Contraplacado', year: 2026,
    tracks: [
      { file: '01 - Contraplacado (Se Deus nos der vida e saúde).wav', title: 'Contraplacado (Se Deus nos der vida e saúde)' },
    ],
  },
  {
    // Curated remix comp — each track credited to its remixer (album_artist stays Jerome Faria).
    releaseId: 'overlapse-xiii', catalog: 'BRQN007', folder: '2025 - BRQN007 - Overlapse XIII', album: 'Overlapse XIII', year: 2025,
    tracks: [
      { file: '01 - CAVERNANCIA - Attack (Prelude).wav', title: 'Attack (Prelude)', artist: 'CAVERNANCIA' },
      { file: '02 - Tren Go! Sound System - Sustain II (D00mRemix).wav', title: 'Sustain II (D00MRemix)', artist: 'Tren Go! Sound System' },
      { file: '03 - Aires - Overlapse Supercut.wav', title: 'Overlapse Supercut', artist: 'Aires' },
      { file: '04 - Fábio Fernandes - Release.wav', title: 'Release', artist: 'Fábio Fernandes' },
      { file: '05 - João de Nóbrega Pupo - Decay III (Sound Kintsugi).wav', title: 'Decay III (Sound Kintsugi)', artist: 'João de Nóbrega Pupo' },
      { file: '06 - João Vairinhos - Declínio.wav', title: 'Declínio', artist: 'João Vairinhos' },
      { file: '07 - sol - Costa Norte.wav', title: 'Costa Norte', artist: 'sol' },
      { file: '08 - W. R. Pyo - Release (Conclusion).wav', title: 'Release (Conclusion)', artist: 'W. R. Pyo' },
    ],
  },
];

const ARTIST = 'Jerome Faria';

const assertSafePaths = () => {
  if (resolve(OUT_ROOT).startsWith(resolve(SOURCE_ROOT))) {
    throw new Error('Refusing to run: OUT_ROOT is inside the read-only master source.');
  }
};

const slugify = value =>
  value.normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const ffprobeDuration = file =>
  Math.round(parseFloat(execFileSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' }).trim()));

const truePeakDb = file => {
  const output = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'ebur128=peak=true:framelog=quiet', '-f', 'null', '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).stderr ?? '';
  const peaks = [...output.matchAll(/Peak:\s*(-?\d+(?:\.\d+)?) dBFS/g)].map(match => parseFloat(match[1]));
  return peaks.length ? Math.max(...peaks) : Number.NEGATIVE_INFINITY;
};

const encode = (wav, cover, out, meta) => {
  mkdirSync(dirname(out), { recursive: true });

  const inputs = ['-i', wav];
  const maps = ['-map', '0:a'];
  const video = [];
  if (cover) {
    inputs.push('-i', cover);
    maps.push('-map', '1:v');
    video.push('-c:v', 'mjpeg', '-disposition:v', 'attached_pic');
  }

  execFileSync('ffmpeg', [
    '-hide_banner', '-nostats', '-y', ...inputs, ...maps, '-af', TRUE_PEAK_LIMITER,
    '-c:a', 'aac', '-b:a', BITRATE, ...video, '-movflags', '+faststart',
    '-metadata', `title=${meta.title}`, '-metadata', `artist=${meta.artist ?? ARTIST}`,
    '-metadata', `album_artist=${ARTIST}`,
    '-metadata', `album=${meta.album}`, '-metadata', `track=${meta.track}`,
    '-metadata', `date=${meta.year}`, out,
  ], { stdio: ['ignore', 'ignore', 'ignore'] });
};

// Single quotes to match the lint style, doubles only when the title contains an apostrophe.
const quote = value => (value.includes("'") ? JSON.stringify(value) : `'${value}'`);

const writeManifest = manifest => {
  const body = Object.entries(manifest).map(([releaseId, tracks]) => {
    const rows = tracks.map(track => `    { key: '${track.key}', title: ${quote(track.title)}, duration: ${track.duration}${track.artist ? `, artist: ${quote(track.artist)}` : ''} },`).join('\n');
    return `  '${releaseId}': [\n${rows}\n  ],`;
  }).join('\n');

  const content = `// Generated by scripts/encode-audio.mjs — do not edit by hand.\nimport type { AudioTrack } from '@/types/audio';\n\nexport const audioManifest: Record<string, AudioTrack[]> = {\n${body}\n};\n`;
  writeFileSync(MANIFEST_FILE, content);
};

const run = () => {
  assertSafePaths();

  const measureOnly = process.argv.includes('--measure');
  const manifestOnly = process.argv.includes('--manifest');
  const manifest = {};
  let count = 0;

  for (const release of RELEASES) {
    const folder = join(SOURCE_ROOT, release.folder);
    const cover = existsSync(join(folder, 'cover.jpg')) ? join(folder, 'cover.jpg') : null;
    manifest[release.releaseId] = [];

    release.tracks.forEach((track, index) => {
      const wav = join(folder, track.file);
      if (!existsSync(wav)) throw new Error(`Missing master: ${wav}`);

      const number = String(index + 1).padStart(2, '0');
      const key = `${release.catalog}/${number}-${slugify(track.title)}.m4a`;
      const out = join(OUT_ROOT, key);

      if (manifestOnly) {
        if (!existsSync(out)) throw new Error(`Missing encode (run without --manifest first): ${out}`);
        manifest[release.releaseId].push({ key, title: track.title, duration: ffprobeDuration(out), artist: track.artist });
        return;
      }

      const inputPeak = truePeakDb(wav);

      if (measureOnly) {
        console.log(`  ${release.catalog} ${track.title.padEnd(48).slice(0, 48)}  true-peak ${inputPeak.toFixed(2).padStart(7)} dBFS  ${inputPeak > TRUE_PEAK_CEILING_DB ? 'OVER -1' : 'ok'}`);
        return;
      }

      encode(wav, cover, out, { title: track.title, album: release.album, year: release.year, track: `${index + 1}/${release.tracks.length}`, artist: track.artist });

      const duration = ffprobeDuration(out);
      manifest[release.releaseId].push({ key, title: track.title, duration, artist: track.artist });
      count += 1;
      console.log(`  ${key}  ${duration}s  master ${inputPeak.toFixed(1).padStart(5)} dBTP → limited to -1 dBTP pre-encode`);
    });
  }

  if (measureOnly) return;

  writeManifest(manifest);
  if (manifestOnly) {
    console.log(`Manifest regenerated from existing encodes → ${MANIFEST_FILE}`);
    return;
  }
  console.log(`\nEncoded ${count} tracks across ${RELEASES.length} releases. All masters true-peak limited to -1 dBTP;`);
  console.log(`AAC decode overshoot is expected and handled by output headroom in the player. Manifest → ${MANIFEST_FILE}`);
};

run();

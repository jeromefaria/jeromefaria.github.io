import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadData } from './data-loader.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ROOT = '/Volumes/Audio/Audio/Releases';
const OUT_ROOT = join(REPO_ROOT, 'audio-dist');
const MANIFEST_FILE = join(REPO_ROOT, 'src', 'data', 'audioManifest.ts');
const BITRATE = '256k';
const TRUE_PEAK_CEILING_DB = -1;

const TRUE_PEAK_LIMITER = 'aresample=192000,alimiter=limit=0.891:level=false,aresample=48000';

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
      { file: '01 - Attack (Prelude).wav', title: 'Attack (Prelude)', artwork: '/images/tracks/overlapse-01.jpg' },
      { file: '02 - Sustain I.wav', title: 'Sustain I', artwork: '/images/tracks/overlapse-02.jpg' },
      { file: '03 - Sustain II.wav', title: 'Sustain II', artwork: '/images/tracks/overlapse-03.jpg' },
      { file: '04 - Decay I.wav', title: 'Decay I', artwork: '/images/tracks/overlapse-04.jpg' },
      { file: '05 - Decay II.wav', title: 'Decay II', artwork: '/images/tracks/overlapse-05.jpg' },
      { file: '06 - Decay III.wav', title: 'Decay III', artwork: '/images/tracks/overlapse-06.jpg' },
      { file: '07 - Release (Conclusion).wav', title: 'Release (Conclusion)', artwork: '/images/tracks/overlapse-07.jpg' },
    ],
  },
  {
    releaseId: 'caligari-album', catalog: 'BRQN005',
    folder: '2023 - BRQN005 - Music Written & Performed for The Cabinet of Dr. Caligari',
    album: 'Music Written & Performed for The Cabinet of Dr. Caligari', year: 2023,
    tracks: [
      { file: '01 - Spirits Surround Us On Every Side.wav', title: 'Spirits Surround Us On Every Side', artwork: '/images/tracks/caligari-01.jpg' },
      { file: '02 - Awaken For A Moment From Your Dark Night.wav', title: 'Awaken For A Moment From Your Dark Night', artwork: '/images/tracks/caligari-02.jpg' },
      { file: '03 - How Long Will I Live.wav', title: 'How Long Will I Live?', artwork: '/images/tracks/caligari-03.jpg' },
      { file: "04 - It Couldn't Have Been Cesare.wav", title: "It Couldn't Have Been Cesare...", artwork: '/images/tracks/caligari-04.jpg' },
      { file: '05 - We Who Are Of Noble Blood May Not Follow The Wishes Of Our Hearts.wav', title: 'We Who Are Of Noble Blood May Not Follow The Wishes Of Our Hearts', artwork: '/images/tracks/caligari-05.jpg' },
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
  {
    releaseId: 'depolarized', catalog: 'BRQN003',
    root: '/Volumes/Audio/Audio/Documents/Label/Releases',
    folder: '2012 - BRQN003 - Jerome Faria + Nelson P. Ferreira - Depolarized',
    album: 'Depolarized', year: 2012,
    tracks: [
      { file: '01 - Depolarized.wav', title: 'Depolarized', artist: 'Jerome Faria + Nelson P. Ferreira' },
    ],
  },
  {
    releaseId: 'altar', catalog: 'CCA035',
    root: '/Volumes/Audio/Audio/Projects/Collaborations',
    folder: 'NOx/ALTAR',
    album: 'ALTAR', year: 2024,
    tracks: [
      { file: 'NOx - ALTAR - 01 A.aiff', title: 'A', artist: 'NOx', artwork: '/images/tracks/altar.jpg' },
      { file: 'NOx - ALTAR - 02 L.aiff', title: 'L', artist: 'NOx', artwork: '/images/tracks/altar.jpg' },
      { file: 'NOx - ALTAR - 03 T.aiff', title: 'T', artist: 'NOx', artwork: '/images/tracks/altar.jpg' },
      { file: 'NOx - ALTAR - 04 A.aiff', title: 'A', artist: 'NOx', artwork: '/images/tracks/altar.jpg' },
      { file: 'NOx - ALTAR - 05 R.aiff', title: 'R', artist: 'NOx', artwork: '/images/tracks/altar.jpg' },
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

const quote = value => (value.includes("'") ? JSON.stringify(value) : `'${value}'`);

const writeManifest = manifest => {
  const body = Object.entries(manifest).map(([releaseId, tracks]) => {
    const rows = tracks.map(track => `    { key: '${track.key}', title: ${quote(track.title)}, duration: ${track.duration}${track.artist ? `, artist: ${quote(track.artist)}` : ''}${track.artwork ? `, artwork: ${quote(track.artwork)}` : ''} },`).join('\n');
    return `  '${releaseId}': [\n${rows}\n  ],`;
  }).join('\n');

  const content = `// eslint-disable-next-line local/no-comments -- hand-editing this generated manifest is silently lost on the next encode-audio run\n// Generated by scripts/encode-audio.mjs — do not edit by hand.\nimport type { AudioTrack } from '@/types/audio';\n\nexport const audioManifest: Record<string, AudioTrack[]> = {\n${body}\n};\n`;
  writeFileSync(MANIFEST_FILE, content);
};

const run = async () => {
  assertSafePaths();

  const measureOnly = process.argv.includes('--measure');
  const manifestOnly = process.argv.includes('--manifest');
  const onlyIndex = process.argv.indexOf('--only');
  const onlyIds = onlyIndex >= 0 ? process.argv[onlyIndex + 1]?.split(',').map(id => id.trim()) : null;
  const releases = onlyIds ? RELEASES.filter(release => onlyIds.includes(release.releaseId)) : RELEASES;

  const manifest = {};
  if (onlyIds && !measureOnly) {
    const { audioManifest: existing } = await loadData('src/data/audioManifest.ts');
    Object.assign(manifest, existing);
  }
  let count = 0;

  for (const release of releases) {
    const folder = join(release.root ?? SOURCE_ROOT, release.folder);
    const cover = ['cover.jpg', 'cover.png'].map(name => join(folder, name)).find(existsSync) ?? null;
    manifest[release.releaseId] = [];

    release.tracks.forEach((track, index) => {
      const wav = join(folder, track.file);
      if (!existsSync(wav)) throw new Error(`Missing master: ${wav}`);

      const number = String(index + 1).padStart(2, '0');
      const key = `${release.catalog}/${number}-${slugify(track.title)}.m4a`;
      const out = join(OUT_ROOT, key);

      if (manifestOnly) {
        if (!existsSync(out)) throw new Error(`Missing encode (run without --manifest first): ${out}`);
        manifest[release.releaseId].push({ key, title: track.title, duration: ffprobeDuration(out), artist: track.artist, artwork: track.artwork });
        return;
      }

      const inputPeak = truePeakDb(wav);

      if (measureOnly) {
        console.log(`  ${release.catalog} ${track.title.padEnd(48).slice(0, 48)}  true-peak ${inputPeak.toFixed(2).padStart(7)} dBFS  ${inputPeak > TRUE_PEAK_CEILING_DB ? 'OVER -1' : 'ok'}`);
        return;
      }

      encode(wav, cover, out, { title: track.title, album: release.album, year: release.year, track: `${index + 1}/${release.tracks.length}`, artist: track.artist });

      const duration = ffprobeDuration(out);
      manifest[release.releaseId].push({ key, title: track.title, duration, artist: track.artist, artwork: track.artwork });
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
  console.log(`\nEncoded ${count} tracks across ${releases.length} releases. All masters true-peak limited to -1 dBTP;`);
  console.log(`AAC decode overshoot is expected and handled by output headroom in the player. Manifest → ${MANIFEST_FILE}`);
};

await run();

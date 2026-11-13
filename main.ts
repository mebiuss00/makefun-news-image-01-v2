// news-image-01 entry: writes the bundled front page to /output/entry.png.
// The file is a dated collage of Friday 13 November 2026's world news, so
// this program only has to pass the image through the gate untouched: it
// verifies the gate limits (a whole JPEG or PNG, at most 1 MiB) and copies.
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ENTRY = new URL('./entry.png', import.meta.url);
const image = readFileSync(ENTRY);

const ONE_MIB = 1_048_576;
if (image.length > ONE_MIB) {
  throw new Error(`entry.png is ${image.length} bytes, over the 1 MiB gate`);
}

const isJpeg = image[0] === 0xff && image[1] === 0xd8;
const isPng = image[0] === 0x89 && image[1] === 0x50 && image[2] === 0x4e && image[3] === 0x47;
if (!isJpeg && !isPng) throw new Error('entry.png is neither a JPEG nor a PNG file');

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(ENTRY, join(outDir, 'entry.png'));

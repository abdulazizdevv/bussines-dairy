/**
 * Hero: Uber wordmark on white. Inline: white wordmark on black.
 * Logo: Wikimedia Commons — https://commons.wikimedia.org/wiki/File:Uber_logo_2018.png
 */
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicImages = join(root, 'public/images');

const LOGO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png';

const res = await fetch(LOGO_URL);
if (!res.ok) throw new Error(`Failed to fetch logo: ${res.status}`);
const logoBuf = Buffer.from(await res.arrayBuffer());

await mkdir(publicImages, { recursive: true });

const heroLogo = await sharp(logoBuf)
  .resize({ width: 920 })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1400,
    height: 720,
    channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite([{ input: heroLogo, gravity: 'center' }])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(join(publicImages, 'uber-hero.jpg'));

const inlineLogo = await sharp(logoBuf)
  .resize({ width: 640 })
  .flatten({ background: { r: 255, g: 255, b: 255 } })
  .negate()
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1200,
    height: 480,
    channels: 3,
    background: { r: 0, g: 0, b: 0 },
  },
})
  .composite([{ input: inlineLogo, gravity: 'center' }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(join(publicImages, 'uber-inline.jpg'));

console.log('Wrote public/images/uber-hero.jpg and uber-inline.jpg');

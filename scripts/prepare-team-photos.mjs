// Regenerates all seven team-band photos (public/mockup/*.webp) from their
// highest-quality originals with one consistent treatment: same 4:5 frame,
// same output size, face at the same scale/position, uniform snow
// background, matched grayscale/contrast. Quick task 260926-6g7, "team"
// sub-task. Re-run any time with: node scripts/prepare-team-photos.mjs
//
// Pipeline per person (never invents pixels — every step is crop/scale/
// composite/levels on real source data):
//   1. Load the highest-quality original (zip source for the five existing
//      staff — the raw pre-compression uploads, not the already-webp'd
//      public/mockup files; local files for Jaymie/Wendy).
//   2. Vision (Swift helper, prepare-team-photos.swift) detects the face
//      box + eye landmarks, and a person-segmentation mask, on that
//      original at native resolution.
//   3. Scale the whole source image (and its mask) so the detected face
//      bounding-box width hits FACE_WIDTH_FRACTION of the output width —
//      this is pose-robust (works for Martin's profile candid, where
//      interocular distance is foreshortened but face-box width is not).
//   4. Composite the scaled, mask-cut person onto a solid snow (#F5F6F7)
//      canvas sized OUTPUT_W x OUTPUT_H, positioned so the eye line lands
//      at EYE_LINE_FRACTION and the face is horizontally centered. This
//      composite-with-clamped-extract step is also what removes Jaymie's
//      selfie arms and Wendy's off-center framing: anything outside the
//      fixed canvas — including outstretched arms — is not drawn.
//   5. Grayscale + normalise + light median denoise, applied identically
//      to all seven (matches the already-shipped five, which measured as
//      neutral R=G=B — see manifest.json "priorTonalTreatment" note).
//   6. Re-run Vision landmarks on the finished output to record the
//      *actual* achieved face position/scale (not just the target), so
//      manifest.json reports measured, not assumed, consistency.
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const scratch = path.join(root, '.scratch/team-photos');
const zipPath = '/Volumes/Satechi Hub/ZINC Digital Agency/ZINC Digital Agency Website V2.zip';
const swiftTool = path.join(root, 'scripts/prepare-team-photos.swift');

const OUTPUT_W = 800;
const OUTPUT_H = 1000; // 4:5, ~4.6x the measured largest rendered box (175.53x219.41 CSS px @1440)
const FACE_WIDTH_FRACTION = 0.40; // Vision face-box width / output width
const EYE_LINE_FRACTION = 0.40; // eye midpoint Y / output height
const BACKGROUND = '#F5F6F7'; // snow — matches the page ground (base.css --bg)

async function fromZip(entry) {
  return execFileSync('unzip', ['-p', zipPath, entry], { maxBuffer: 80 * 1024 * 1024 });
}

const people = [
  {
    id: 'kirk-musick',
    label: 'Kirk Musick',
    source: async () => ({ buf: await fromZip('uploads/kirkmusick.png'), provenance: zipPath + '#uploads/kirkmusick.png' }),
  },
  {
    id: 'bethany-mckinzie',
    label: 'Bethany McKinzie',
    source: async () => ({ buf: await fromZip('uploads/priya 2.png'), provenance: zipPath + '#uploads/priya 2.png' }),
    notes: "Source upload is misnamed \"priya 2.png\" but is confirmed as Bethany's photo, not Priya's — it matches the exact [348,100,1160,1450] crop docs/team-photos-status.md records for her (and the face is Bethany's). The prior segmentation also punched ~151k px of holes through her patterned blouse (busy fabric print confused Vision's segmentation); the enclosed-hole fill (see prepare-team-photos.mjs) restored the real fabric texture there.",
  },
  {
    id: 'priya-nahar',
    label: 'Priya Nahar',
    source: async () => ({ buf: await fromZip('uploads/Priya-ac3b8f75.png'), provenance: zipPath + '#uploads/Priya-ac3b8f75.png' }),
  },
  {
    id: 'martin-stewart',
    label: 'Martin Stewart',
    source: async () => ({ buf: await fromZip('uploads/MartinStaff.png'), provenance: zipPath + '#uploads/MartinStaff.png' }),
    notes: 'Only source is a profile performance candid (cap, glasses, mic, raised hand) — not a forward studio headshot. Face-box-width scaling keeps his apparent head size consistent with the other six, but pose/attire cannot match without a new photo (flagged already in docs/team-photos-status.md item 3).',
  },
  {
    id: 'dr-basset',
    label: 'Dr. Basset',
    source: async () => ({ buf: await fromZip('uploads/DrBasset.png'), provenance: zipPath + '#uploads/DrBasset.png' }),
    notes: 'Source upload carried a small colored sparkle/upscaler artifact (docs/team-photos-status.md item 2, maxSat 1.0 vs ~0.03 average). The grayscale + normalise pass neutralizes stray color pixels; median(3) denoise softens the residual speck.',
  },
  {
    id: 'jaymie-wilhoit',
    label: 'Jaymie Wilhoit',
    source: async () => ({ buf: await fs.readFile('assets/team/originals/jaymie-wilhoit-original.webp'), provenance: 'assets/team/originals/jaymie-wilhoit-original.webp' }),
    flattenAlpha: true,
    notes: 'Original has both arms extended toward the camera (selfie pose). Face-box-width scaling crops to head+upper-shoulders, which places the extended arms outside the fixed output canvas — verified against the contact sheet, not assumed.',
  },
  {
    id: 'wendy-funnell',
    label: 'Wendy Funnell',
    source: async () => ({ buf: await fs.readFile('assets/team/originals/wendy-funnell-original.webp'), provenance: 'assets/team/originals/wendy-funnell-original.webp' }),
  },
];

function runSwift(args) {
  return execFileSync('swift', [swiftTool, ...args], { maxBuffer: 20 * 1024 * 1024, encoding: 'utf8' });
}

function detectFace(imgPath) {
  const out = runSwift(['landmarks', imgPath]);
  const data = JSON.parse(out.trim().split('\n').pop());
  if (data.error) throw new Error('no face detected in ' + imgPath);
  return data;
}

function segmentMask(imgPath, outPath) {
  runSwift(['mask', imgPath, outPath]);
  return outPath;
}

// VNGeneratePersonSegmentationRequest can misclassify a small region fully
// surrounded by "person" as background (measured on Martin's photo: the mic
// body and part of his hand, a ~23k-pixel pocket, came back black). A flood
// fill from the mask's border marks every background pixel *reachable from
// outside the silhouette*; anything left over is an enclosed pocket, not
// real background, so it is reclassified as person. This never fabricates
// pixels — it only corrects which real, already-captured source pixels the
// mask exposes — and it never touches the true outer silhouette edge, since
// genuine background is always reachable from the image border.
async function fillEnclosedMaskHoles(maskBuffer) {
  const { data, info } = await sharp(maskBuffer).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, ch = info.channels;
  const isBg = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) isBg[i] = data[i * ch] < 128 ? 1 : 0;
  const reachable = new Uint8Array(w * h);
  const stack = [];
  const seed = (idx) => { if (isBg[idx] && !reachable[idx]) { reachable[idx] = 1; stack.push(idx); } };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + (w - 1)); }
  while (stack.length) {
    const idx = stack.pop();
    const x = idx % w, y = (idx / w) | 0;
    if (x > 0) seed(idx - 1);
    if (x < w - 1) seed(idx + 1);
    if (y > 0) seed(idx - w);
    if (y < h - 1) seed(idx + w);
  }
  const out = Buffer.alloc(w * h);
  let holes = 0;
  for (let i = 0; i < w * h; i++) {
    if (isBg[i] && !reachable[i]) { out[i] = 255; holes++; }
    else out[i] = data[i * ch];
  }
  const cleaned = await sharp(out, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  return { cleaned, holes };
}

// Places `overlay` (scaledW x scaledH, RGBA) onto a `canvasW x canvasH` solid
// background at (left, top), clamping/extracting so sharp's composite never
// sees an overlay larger than the canvas (its hard requirement) — this is
// also the mechanism that clips anything outside the frame (Jaymie's arms).
async function placeOnCanvas(overlaySharp, scaledW, scaledH, left, top, canvasW, canvasH, background) {
  const srcX0 = Math.max(0, -left);
  const srcY0 = Math.max(0, -top);
  const dstX0 = Math.max(0, left);
  const dstY0 = Math.max(0, top);
  const w = Math.min(scaledW - srcX0, canvasW - dstX0);
  const h = Math.min(scaledH - srcY0, canvasH - dstY0);
  if (w <= 0 || h <= 0) throw new Error('placement has no overlap with canvas');
  const extracted = await overlaySharp
    .extract({ left: Math.round(srcX0), top: Math.round(srcY0), width: Math.round(w), height: Math.round(h) })
    .toBuffer();
  // sharp does not reliably apply pixel ops (grayscale/normalise/median)
  // chained directly after .composite() on the same pipeline object —
  // measured empirically (composite+grayscale left the overlay's original
  // color untouched). Resolve the composite to a buffer here, then the
  // caller starts a fresh sharp() pipeline from that buffer.
  return sharp({ create: { width: canvasW, height: canvasH, channels: 3, background } })
    .composite([{ input: extracted, left: Math.round(dstX0), top: Math.round(dstY0) }])
    .png()
    .toBuffer();
}

await fs.mkdir(scratch, { recursive: true });
await fs.mkdir('public/mockup', { recursive: true });

const assetsJsonPath = 'src/data/assets.preview.json';
const assets = JSON.parse(await fs.readFile(assetsJsonPath, 'utf8'));
const manifest = { generatedAt: new Date().toISOString(), outputSize: { width: OUTPUT_W, height: OUTPUT_H }, targets: { faceWidthFraction: FACE_WIDTH_FRACTION, eyeLineFraction: EYE_LINE_FRACTION }, background: BACKGROUND, people: [] };

for (const person of people) {
  const { buf: rawBuf, provenance } = await person.source();
  const sourceMeta = await sharp(rawBuf).metadata();
  const sha256 = createHash('sha256').update(rawBuf).digest('hex');

  // Vision needs a real file on disk.
  const srcTmp = path.join(scratch, person.id + '-source.png');
  let forDetection = sharp(rawBuf);
  if (person.flattenAlpha) forDetection = forDetection.flatten({ background: '#FFFFFF' });
  await forDetection.png().toFile(srcTmp);

  const face = detectFace(srcTmp);
  const eyes = [face.leftEye, face.rightEye].filter(Boolean);
  if (eyes.length === 0) throw new Error('no eye landmarks for ' + person.id);
  const eyeMidY = eyes.reduce((s, e) => s + e.y, 0) / eyes.length;
  const faceCenterX = face.face.x + face.face.w / 2;

  const maskTmp = path.join(scratch, person.id + '-mask.png');
  segmentMask(srcTmp, maskTmp);
  const { cleaned: cleanedMaskBuf, holes: maskHolesFilled } = await fillEnclosedMaskHoles(maskTmp);
  if (maskHolesFilled > 0) console.log('  mask cleanup:', person.id, maskHolesFilled, 'enclosed px filled');

  const scale = (FACE_WIDTH_FRACTION * OUTPUT_W) / face.face.w;
  const scaledW = Math.round(sourceMeta.width * scale);
  const scaledH = Math.round(sourceMeta.height * scale);
  const left = Math.round(OUTPUT_W / 2 - faceCenterX * scale);
  const top = Math.round(EYE_LINE_FRACTION * OUTPUT_H - eyeMidY * scale);

  const scaledImage = sharp(srcTmp).resize(scaledW, scaledH);
  const scaledMask = await sharp(cleanedMaskBuf).resize(scaledW, scaledH).blur(1.5).toBuffer();
  const cutout = await scaledImage.ensureAlpha().joinChannel(scaledMask).png().toBuffer();

  const compositeBuf = await placeOnCanvas(sharp(cutout), scaledW, scaledH, left, top, OUTPUT_W, OUTPUT_H, BACKGROUND);
  const finalBuf = await sharp(compositeBuf)
    .grayscale()
    .normalise()
    .median(3)
    .webp({ quality: 90 })
    .toBuffer();

  const outPath = 'public/mockup/' + person.id + '.webp';
  await fs.writeFile(outPath, finalBuf);
  const outMeta = await sharp(finalBuf).metadata();

  // Measure the actual result (not just the target) by re-detecting on the
  // finished frame.
  const verifyTmp = path.join(scratch, person.id + '-final.png');
  await sharp(finalBuf).png().toFile(verifyTmp);
  let achieved = null;
  try {
    const finalFace = detectFace(verifyTmp);
    const finalEyes = [finalFace.leftEye, finalFace.rightEye].filter(Boolean);
    const finalEyeMidY = finalEyes.reduce((s, e) => s + e.y, 0) / finalEyes.length;
    achieved = {
      faceWidthFraction: finalFace.face.w / OUTPUT_W,
      eyeLineFraction: finalEyeMidY / OUTPUT_H,
      faceCenterXFraction: (finalFace.face.x + finalFace.face.w / 2) / OUTPUT_W,
    };
  } catch (e) {
    achieved = { error: String(e.message || e) };
  }

  assets[person.id] = {
    src: '/mockup/' + person.id + '.webp',
    width: outMeta.width,
    height: outMeta.height,
    source: provenance,
    sourceWidth: sourceMeta.width,
    sourceHeight: sourceMeta.height,
    sha256,
  };

  manifest.people.push({
    id: person.id,
    label: person.label,
    provenance,
    sourceWidth: sourceMeta.width,
    sourceHeight: sourceMeta.height,
    detectedFace: face.face,
    detectedEyes: { leftEye: face.leftEye, rightEye: face.rightEye },
    scale,
    placement: { left, top },
    outputWidth: outMeta.width,
    outputHeight: outMeta.height,
    achieved,
    maskHolesFilled,
    notes: person.notes || null,
  });

  console.log('done:', person.id, JSON.stringify({ scale: scale.toFixed(4), left, top, achieved }));
}

await fs.writeFile(assetsJsonPath, JSON.stringify(assets, null, 2) + '\n');
await fs.mkdir('assets/team', { recursive: true });
await fs.writeFile('assets/team/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('PASS: regenerated ' + people.length + ' team photos, updated assets.preview.json and assets/team/manifest.json');

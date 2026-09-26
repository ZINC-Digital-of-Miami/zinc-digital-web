// Regenerates all seven team-band photos (public/mockup/*.webp) from their
// highest-quality originals with one consistent treatment: same 4:5 frame,
// same output size, face at the same scale/position, every source running
// to the frame's bottom edge (no floating cut), uniform snow background,
// matched exposure/contrast/tone. Quick task 260926-6g7, "team" sub-task.
// Re-run any time with: node scripts/prepare-team-photos.mjs
//
// Three-phase pipeline (never invents pixels — every step is crop/scale/
// composite/levels on real source data):
//
// Phase 1 — measure. Vision (Swift helper, prepare-team-photos.swift)
// detects each source's face box + eye landmarks at native resolution.
// FACE_WIDTH_FRACTION is then *derived*, not hardcoded: for the chosen
// EYE_LINE_FRACTION, compute the minimum face-width fraction each source
// needs so its own bottom edge reaches the output frame's bottom edge (no
// empty background floating below the torso) — the limiting (most
// shallow-below-the-eyes) source sets the shared value for all seven, plus
// a small margin for rounding. See "geometry constraint" below.
//
// Phase 2 — render. Person-segmentation cutout (with enclosed-hole repair)
// scaled to the shared FACE_WIDTH_FRACTION, composited onto a solid snow
// canvas with the eye line at EYE_LINE_FRACTION, then grayscale. This
// composite-with-clamped-extract step is also what removes Jaymie's selfie
// arms: anything outside the fixed canvas is not drawn (verified
// empirically against her segmentation mask — see manifest notes).
//
// Phase 3 — calibrate + encode. Per-image face-region and background-region
// luminance are measured on the plain grayscale composite, then a single
// linear levels transform (sharp .linear(a,b), a real two-point tonal
// remap, not per-image auto-normalise) brings every image's background to
// the literal canvas color and every image's face toward the shared
// cross-person median — this is what fixes Kirk reading darker/harsher
// than the other six under independent auto-normalise. Light median
// denoise, then webp encode. Vision re-runs on the finished frame to
// record the *achieved* face position, and manifest.json records
// before/after luminance for every image.
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
const EYE_LINE_FRACTION = 0.40; // eye midpoint Y / output height
const GEOMETRY_MARGIN = 1.03; // 3% safety margin above the exact geometric minimum, for rounding
const BACKGROUND = '#F5F6F7'; // snow — matches the page ground (base.css --bg)
const FACE_SAMPLE_INSET = 0.25; // sample the central (1-2*inset) box of the detected face for luminance

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
    notes: 'Source upload carried a small colored sparkle/upscaler artifact (docs/team-photos-status.md item 2, maxSat 1.0 vs ~0.03 average). The grayscale + levels-calibration pass neutralizes stray color pixels; median(3) denoise softens the residual speck.',
  },
  {
    id: 'jaymie-wilhoit',
    label: 'Jaymie Wilhoit',
    source: async () => ({ buf: await fs.readFile('assets/team/originals/jaymie-wilhoit-original.webp'), provenance: 'assets/team/originals/jaymie-wilhoit-original.webp' }),
    flattenAlpha: true,
    notes: 'Original has both arms extended toward the camera (selfie pose). The shared geometry-derived crop (driven by Wendy, the limiting source — see manifest "geometryConstraint") crops well above her arms; verified empirically by rendering her alone at a range of face-width fractions from 0.55 up and inspecting each — arms were already fully outside frame at 0.55, well below the ~0.59 shared value the Wendy constraint requires.',
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
  // sharp does not reliably apply pixel ops (grayscale/linear/median) chained
  // directly after .composite() on the same pipeline object — measured
  // empirically (composite+grayscale left the overlay's original color
  // untouched). Resolve the composite to a buffer here, then the caller
  // starts a fresh sharp() pipeline from that buffer.
  return sharp({ create: { width: canvasW, height: canvasH, channels: 3, background } })
    .composite([{ input: extracted, left: Math.round(dstX0), top: Math.round(dstY0) }])
    .png()
    .toBuffer();
}

// Measured bug: sharp's PNG encoder silently expands a single-channel raw
// buffer to 3-channel RGB (R=G=B) on decode — so a "grayscale" buffer that's
// been through a .png() round-trip can decode as 1 OR 3 channels depending
// on its history. Always read info.channels and stride by it (channel 0 is
// the luminance value either way); never assume 1 byte/pixel or sum every
// byte in the buffer (that silently pulled in alpha/repeated channels and
// inflated every luminance reading in an earlier version of this script).
async function regionMean(buffer, box) {
  const meta = await sharp(buffer).metadata();
  const left = Math.max(0, Math.round(box.left));
  const top = Math.max(0, Math.round(box.top));
  const width = Math.min(Math.round(box.width), meta.width - left);
  const height = Math.min(Math.round(box.height), meta.height - top);
  if (width <= 0 || height <= 0) return null;
  const { data, info } = await sharp(buffer).extract({ left, top, width, height }).raw().toBuffer({ resolveWithObject: true });
  let sum = 0, n = 0;
  for (let i = 0; i < info.width * info.height; i++) { sum += data[i * info.channels]; n++; }
  return sum / n;
}

// Fixed corner patches assume the corners are always pure background — false
// once the shared geometry-derived crop got tight enough that a subject's
// shoulders/hair reach into a canvas corner (measured: Dr. Basset's suit and
// Wendy's hair did exactly this at F~0.60, corrupting the corner-patch
// background reading and blowing out the whole image after calibration).
// Ground truth is the placed person-segmentation mask itself: any canvas
// pixel the mask calls background (value < threshold), anywhere on the
// canvas, is sampled — never assumed by position.
async function backgroundMeanFromMask(grayscaleBuffer, placedMaskRaw, threshold = 30) {
  const gray = await sharp(grayscaleBuffer).raw().toBuffer({ resolveWithObject: true });
  const gch = gray.info.channels;
  let sum = 0, n = 0;
  for (let i = 0; i < gray.info.width * gray.info.height; i++) {
    if (placedMaskRaw[i] < threshold) { sum += gray.data[i * gch]; n++; }
  }
  if (n === 0) return null;
  return sum / n;
}

// Same clamped placement math as placeOnCanvas, but for the single-channel
// mask onto a canvas that starts as all-background (0) — gives per-pixel
// ground truth for which output pixels are person vs background. Plain raw
// buffer copy (not sharp .composite()) since sharp's create() rejects
// single-channel canvases. Takes maskRawData as an already-decoded raw
// Buffer (exactly scaledW*scaledH bytes, 1 byte/pixel) — never a
// PNG-encoded buffer, which would silently be 3 bytes/pixel on redecode
// (see regionMean) and corrupt this row-stride copy.
function placeMaskOnCanvas(maskRawData, scaledW, scaledH, left, top, canvasW, canvasH) {
  const srcX0 = Math.max(0, -left);
  const srcY0 = Math.max(0, -top);
  const dstX0 = Math.max(0, left);
  const dstY0 = Math.max(0, top);
  const w = Math.min(scaledW - srcX0, canvasW - dstX0);
  const h = Math.min(scaledH - srcY0, canvasH - dstY0);
  const canvas = Buffer.alloc(canvasW * canvasH, 0);
  for (let row = 0; row < Math.round(h); row++) {
    const srcRowStart = (Math.round(srcY0) + row) * scaledW + Math.round(srcX0);
    const dstRowStart = (Math.round(dstY0) + row) * canvasW + Math.round(dstX0);
    maskRawData.copy(canvas, dstRowStart, srcRowStart, srcRowStart + Math.round(w));
  }
  return canvas; // raw single-channel buffer, canvasW x canvasH
}

await fs.mkdir(scratch, { recursive: true });
await fs.mkdir('public/mockup', { recursive: true });

const assetsJsonPath = 'src/data/assets.preview.json';
const assets = JSON.parse(await fs.readFile(assetsJsonPath, 'utf8'));

// ---------- Phase 1: measure — derive the shared FACE_WIDTH_FRACTION ----------
const staged = [];
for (const person of people) {
  const { buf: rawBuf, provenance } = await person.source();
  const sourceMeta = await sharp(rawBuf).metadata();
  const sha256 = createHash('sha256').update(rawBuf).digest('hex');

  const srcTmp = path.join(scratch, person.id + '-source.png');
  let forDetection = sharp(rawBuf);
  if (person.flattenAlpha) forDetection = forDetection.flatten({ background: '#FFFFFF' });
  await forDetection.png().toFile(srcTmp);

  const face = detectFace(srcTmp);
  const eyes = [face.leftEye, face.rightEye].filter(Boolean);
  if (eyes.length === 0) throw new Error('no eye landmarks for ' + person.id);
  const eyeMidY = eyes.reduce((s, e) => s + e.y, 0) / eyes.length;
  const faceCenterX = face.face.x + face.face.w / 2;

  // Geometry constraint: with output height H, eye-line fraction e, this
  // source's own remaining canvas below the eyes (sourceHeight - eyeMidY)
  // must, once scaled, cover at least (1-e)*H so the source's bottom edge
  // lands at or below the output frame's bottom edge (no floating cut).
  // scale = F*OUTPUT_W/face.w, so solving scale*(sourceHeight-eyeMidY) >=
  // (1-e)*H for F gives the per-person minimum face-width fraction below.
  const remainingBelowEyes = sourceMeta.height - eyeMidY;
  const requiredFaceWidthFraction = (OUTPUT_H * (1 - EYE_LINE_FRACTION) * face.face.w) / (OUTPUT_W * remainingBelowEyes);

  staged.push({ person, provenance, sourceMeta, sha256, srcTmp, face, eyeMidY, faceCenterX, requiredFaceWidthFraction });
}

const limiting = staged.reduce((a, b) => (b.requiredFaceWidthFraction > a.requiredFaceWidthFraction ? b : a));
const FACE_WIDTH_FRACTION = limiting.requiredFaceWidthFraction * GEOMETRY_MARGIN;
console.log('geometry: limiting source is', limiting.person.id, '- required F', limiting.requiredFaceWidthFraction.toFixed(4), '-> shared F (with margin)', FACE_WIDTH_FRACTION.toFixed(4));

const bgSwatch = await sharp({ create: { width: 8, height: 8, channels: 3, background: BACKGROUND } }).grayscale().raw().toBuffer();
let bgSwatchSum = 0;
for (const v of bgSwatch) bgSwatchSum += v;
const TARGET_BACKGROUND_LUMINANCE = bgSwatchSum / bgSwatch.length;

const manifest = {
  generatedAt: new Date().toISOString(),
  outputSize: { width: OUTPUT_W, height: OUTPUT_H },
  targets: { faceWidthFraction: FACE_WIDTH_FRACTION, eyeLineFraction: EYE_LINE_FRACTION, targetBackgroundLuminance: TARGET_BACKGROUND_LUMINANCE },
  geometryConstraint: {
    rule: 'requiredF = OUTPUT_H*(1-EYE_LINE_FRACTION)*face.w / (OUTPUT_W*(sourceHeight-eyeMidY)); shared F = max(requiredF over all 7) * ' + GEOMETRY_MARGIN,
    limitingImage: limiting.person.id,
    perPersonRequiredF: Object.fromEntries(staged.map(s => [s.person.id, s.requiredFaceWidthFraction])),
  },
  background: BACKGROUND,
  people: [],
};

// ---------- Phase 2: render — segment, scale, composite, grayscale ----------
const rendered = [];
for (const s of staged) {
  const { person, sourceMeta, srcTmp, face, eyeMidY, faceCenterX } = s;

  const maskTmp = path.join(scratch, person.id + '-mask.png');
  segmentMask(srcTmp, maskTmp);
  const { cleaned: cleanedMaskBuf, holes: maskHolesFilled } = await fillEnclosedMaskHoles(maskTmp);
  if (maskHolesFilled > 0) console.log('  mask cleanup:', person.id, maskHolesFilled, 'enclosed px filled');

  const scale = (FACE_WIDTH_FRACTION * OUTPUT_W) / face.face.w;
  const scaledW = Math.round(sourceMeta.width * scale);
  const scaledH = Math.round(sourceMeta.height * scale);
  const left = Math.round(OUTPUT_W / 2 - faceCenterX * scale);
  const top = Math.round(EYE_LINE_FRACTION * OUTPUT_H - eyeMidY * scale);
  const bottom = top + scaledH;

  // Measured bug (#1 from orchestrator review): sharp's .joinChannel() does
  // not "replace alpha with this mask" the way it looks like it should —
  // because the mask buffer had been through a .png() round-trip and silently
  // decoded as 3-channel (see regionMean comment), joinChannel appended all
  // 3 of those channels to an already-4-channel (RGBA) base, producing a
  // 7-channel image that got corrupted on PNG re-encode: background pixels
  // composited as near-black instead of the transparent-then-canvas-color
  // they should have been. Confirmed empirically (px that should read
  // (245,245,245,0) read (0,0,0,0) after joinChannel) and reproduced isolated
  // from the full pipeline. Fixed by building the RGBA buffer by hand: read
  // the scaled color image and the scaled+blurred mask as true single-stride
  // raw buffers, interleave them ourselves. No sharp per-channel ambiguity.
  const scaledImage = sharp(srcTmp).resize(scaledW, scaledH);
  const { data: scaledMaskRaw } = await sharp(cleanedMaskBuf)
    .resize(scaledW, scaledH)
    .blur(1.5)
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { data: rgbData, info: rgbInfo } = await scaledImage.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(scaledW * scaledH * 4);
  for (let i = 0; i < scaledW * scaledH; i++) {
    rgba[i * 4] = rgbData[i * rgbInfo.channels];
    rgba[i * 4 + 1] = rgbData[i * rgbInfo.channels + 1];
    rgba[i * 4 + 2] = rgbData[i * rgbInfo.channels + 2];
    rgba[i * 4 + 3] = scaledMaskRaw[i];
  }
  const cutout = await sharp(rgba, { raw: { width: scaledW, height: scaledH, channels: 4 } }).png().toBuffer();

  const compositeBuf = await placeOnCanvas(sharp(cutout), scaledW, scaledH, left, top, OUTPUT_W, OUTPUT_H, BACKGROUND);
  const grayscaleBuf = await sharp(compositeBuf).grayscale().png().toBuffer();
  const placedMaskBuf = placeMaskOnCanvas(scaledMaskRaw, scaledW, scaledH, left, top, OUTPUT_W, OUTPUT_H);

  // Luminance measurement (before calibration): face region is the central
  // (1-2*inset) box of the detected face, mapped into output coordinates.
  // Background region is every canvas pixel the *placed segmentation mask*
  // calls background — not fixed corner patches, which measured wrong once
  // a subject's silhouette reached a corner (see backgroundMeanFromMask).
  const faceBoxOutput = {
    left: left + (face.face.x + face.face.w * FACE_SAMPLE_INSET) * scale,
    top: top + (face.face.y + face.face.h * FACE_SAMPLE_INSET) * scale,
    width: face.face.w * (1 - 2 * FACE_SAMPLE_INSET) * scale,
    height: face.face.h * (1 - 2 * FACE_SAMPLE_INSET) * scale,
  };
  const faceLuminanceBefore = await regionMean(grayscaleBuf, faceBoxOutput);
  const backgroundLuminanceBefore = await backgroundMeanFromMask(grayscaleBuf, placedMaskBuf);

  rendered.push({ ...s, maskHolesFilled, scale, left, top, bottom, grayscaleBuf, placedMaskBuf, faceBoxOutput, faceLuminanceBefore, backgroundLuminanceBefore });
}

// ---------- Phase 3: calibrate + encode ----------
// Target face luminance: the median across all seven raw (pre-calibration)
// face-region readings — robust to Kirk being the one outlier, and derived
// from the group rather than picked arbitrarily.
const faceLuminancesSorted = rendered.map(r => r.faceLuminanceBefore).sort((a, b) => a - b);
const mid = Math.floor(faceLuminancesSorted.length / 2);
const TARGET_FACE_LUMINANCE = faceLuminancesSorted.length % 2 === 0
  ? (faceLuminancesSorted[mid - 1] + faceLuminancesSorted[mid]) / 2
  : faceLuminancesSorted[mid];
manifest.targets.targetFaceLuminance = TARGET_FACE_LUMINANCE;

for (const r of rendered) {
  const { person, provenance, sourceMeta, sha256, face, scale, left, top, bottom, grayscaleBuf, faceLuminanceBefore, backgroundLuminanceBefore, maskHolesFilled } = r;

  // Two-point linear levels calibration: map (backgroundLuminanceBefore ->
  // TARGET_BACKGROUND_LUMINANCE) and (faceLuminanceBefore ->
  // TARGET_FACE_LUMINANCE). newValue = a*oldValue + b.
  const denom = (faceLuminanceBefore - backgroundLuminanceBefore);
  const a = Math.abs(denom) > 1e-6 ? (TARGET_FACE_LUMINANCE - TARGET_BACKGROUND_LUMINANCE) / denom : 1;
  const aClamped = Math.max(0.5, Math.min(2.0, a)); // guard against a degenerate two-point fit
  const bRecomputed = TARGET_BACKGROUND_LUMINANCE - aClamped * backgroundLuminanceBefore;

  const calibratedBuf = await sharp(grayscaleBuf).linear(aClamped, bRecomputed).png().toBuffer();
  const faceLuminanceAfter = await regionMean(calibratedBuf, r.faceBoxOutput);
  const backgroundLuminanceAfter = await backgroundMeanFromMask(calibratedBuf, r.placedMaskBuf);

  const finalBuf = await sharp(calibratedBuf).median(3).webp({ quality: 90 }).toBuffer();

  const outPath = 'public/mockup/' + person.id + '.webp';
  await fs.writeFile(outPath, finalBuf);
  const outMeta = await sharp(finalBuf).metadata();

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
    placement: { left, top, bottom, reachesFrameBottom: bottom >= OUTPUT_H },
    outputWidth: outMeta.width,
    outputHeight: outMeta.height,
    achieved,
    maskHolesFilled,
    luminance: {
      faceBefore: faceLuminanceBefore,
      faceAfter: faceLuminanceAfter,
      backgroundBefore: backgroundLuminanceBefore,
      backgroundAfter: backgroundLuminanceAfter,
      calibration: { a: aClamped, b: bRecomputed },
    },
    notes: person.notes || null,
  });

  console.log('done:', person.id, JSON.stringify({
    scale: scale.toFixed(4), left, top, bottom, reachesFrameBottom: bottom >= OUTPUT_H,
    faceLum: [faceLuminanceBefore.toFixed(1), '->', faceLuminanceAfter.toFixed(1)].join(''),
    bgLum: [backgroundLuminanceBefore.toFixed(1), '->', backgroundLuminanceAfter.toFixed(1)].join(''),
    achieved,
  }));
}

await fs.writeFile(assetsJsonPath, JSON.stringify(assets, null, 2) + '\n');
await fs.mkdir('assets/team', { recursive: true });
await fs.writeFile('assets/team/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('PASS: regenerated ' + people.length + ' team photos, updated assets.preview.json and assets/team/manifest.json');

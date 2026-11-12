#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SRC_LIMIT = 1048576; // 1 MiB

const src = path.join(__dirname, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const dest = path.join(outDir, 'entry.png');

// Read source for validation (do not modify it)
const buf = fs.readFileSync(src);

if (buf.length > SRC_LIMIT) {
  throw new Error(`Source file too large (> ${SRC_LIMIT} bytes)`);
}

const isPng = buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
const isJpeg = buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;

if (!isPng && !isJpeg) {
  throw new Error('Source file is not PNG or JPEG (bad magic)');
}

// Passed validation — copy bytes unchanged
fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log(`Validated and copied to ${dest}`);

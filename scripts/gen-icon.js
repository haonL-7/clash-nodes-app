// Generate ICO icon: academic minimalist geometric node network
const fs = require('fs');
const zlib = require('zlib');

function createIconPNG(size) {
  const w = size, h = size;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
    const tb = Buffer.from(type, 'ascii');
    let crc = 0xFFFFFFFF;
    const buf = Buffer.concat([tb, data]);
    for (let i = 0; i < buf.length; i++) { crc ^= buf[i]; for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0); }
    const cb = Buffer.alloc(4); cb.writeUInt32BE((crc ^ 0xFFFFFFFF) >>> 0, 0);
    return Buffer.concat([len, tb, data, cb]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const cx = w / 2, cy = h / 2;
  const triR = size * 0.20;
  const nodes = [
    { x: cx, y: cy - triR },
    { x: cx - triR * 0.866, y: cy + triR * 0.5 },
    { x: cx + triR * 0.866, y: cy + triR * 0.5 }
  ];
  const bgR = 10, bgG = 15, bgB = 30, fgR = 107, fgG = 140, fgB = 255;
  const bgRadius = size * 0.44, nodeRadius = size * 0.05, lineW = size * 0.016;

  function distSeg(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, ls = dx * dx + dy * dy;
    if (ls === 0) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / ls));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  const raw = [];
  for (let y = 0; y < h; y++) {
    raw.push(0);
    for (let x = 0; x < w; x++) {
      let r = bgR, g = bgG, b = bgB, a = 0;
      const dx = x - cx, dy = y - cy, dist = Math.hypot(dx, dy);

      // Background disc
      if (dist <= bgRadius) {
        const ba = Math.min(1, Math.max(0, (bgRadius - dist) / 1.5)) * 255;
        r = bgR; g = bgG; b = bgB; a = Math.round(ba);
      }

      // Connecting lines
      for (let i = 0; i < 3; i++) {
        const n1 = nodes[i], n2 = nodes[(i + 1) % 3];
        if (distSeg(x, y, n1.x, n1.y, n2.x, n2.y) <= lineW) {
          r = fgR; g = fgG; b = fgB; a = 180; break;
        }
      }

      // Node dots
      for (const n of nodes) {
        const nd = Math.hypot(x - n.x, y - n.y);
        if (nd <= nodeRadius) {
          const na = Math.min(1, Math.max(0, (nodeRadius - nd) / 1.5)) * 255;
          r = fgR; g = fgG; b = fgB; a = Math.round(na); break;
        }
      }

      // Subtle outer ring
      if (dist > bgRadius - 1.5 && dist < bgRadius + 1.5) {
        r = fgR; g = fgG; b = fgB; a = 40;
      }

      raw.push(r, g, b, a);
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(raw));
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
}

// Generate at multiple sizes
const sizes = [16, 32, 48, 64, 128, 256];
const pngs = sizes.map(s => ({ size: s, data: createIconPNG(s) }));

// Build ICO
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

let dirs = Buffer.alloc(0), imgs = Buffer.alloc(0);
let offset = 6 + sizes.length * 16;

for (const p of pngs) {
  const e = Buffer.alloc(16);
  const sz = p.size === 256 ? 0 : p.size;
  e.writeUInt8(sz, 0); e.writeUInt8(sz, 1);
  e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(p.data.length, 8); e.writeUInt32LE(offset, 12);
  dirs = Buffer.concat([dirs, e]);
  imgs = Buffer.concat([imgs, p.data]);
  offset += p.data.length;
}

fs.writeFileSync('icon.ico', Buffer.concat([header, dirs, imgs]));
console.log('icon.ico generated (sizes: 16,32,48,64,128,256)');

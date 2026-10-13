// Dibuja en el navegador las imágenes del lanyard (frente, reverso y cinta)
// con la foto, las fuentes y los colores del sitio. Devuelve URLs (data:) para
// pasarle al componente Lanyard.

const PINK = '#F2A2DC';
const LIME = '#C9DB4B';
const SKY = '#A9D6F5';
const ORANGE = '#E8603C';
const INK = '#1e1e1e';

// Nombre real de una fuente cargada con next/font (ej. la de la clase font-title)
function fontFamilyOf(className, fallback) {
  const el = document.createElement('span');
  el.className = className;
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  document.body.appendChild(el);
  const family = getComputedStyle(el).fontFamily || fallback;
  el.remove();
  return family;
}

function loadImage(url) {
  return new Promise(resolve => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function star(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.48;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// Puntos estilo FigJam de fondo
function dots(ctx, w, h, color, gap = 28) {
  ctx.fillStyle = color;
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// Dibuja una imagen recortada para llenar (x, y, w, h)
function drawCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width || w;
  const ih = img.naturalHeight || img.height || h;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

export async function makeBadge({ photoUrl, logoUrl, name, role, place, website }) {
  await document.fonts.ready;
  const title = fontFamilyOf('font-title', 'sans-serif');
  const hand = fontFamilyOf('font-hand', 'cursive');
  const body = fontFamilyOf('font-body', 'sans-serif');
  const [photo, logo] = await Promise.all([loadImage(photoUrl), loadImage(logoUrl)]);

  // Proporción de la tarjeta vertical del Lanyard: 1.6 x 2.25
  const W = 1024;
  const H = 1440;
  // La ranura del clip ocupa la parte de arriba: dejamos ese espacio libre
  const top = 190;

  // ─── Frente ───
  const front = document.createElement('canvas');
  front.width = W;
  front.height = H;
  let ctx = front.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  dots(ctx, W, H, 'rgba(0,0,0,0.07)');
  // Franja de color arriba
  ctx.fillStyle = PINK;
  ctx.fillRect(0, 0, W, top - 40);

  // Foto con marco y cinta
  const px = 112;
  const py = top + 40;
  const pw = W - px * 2;
  const ph = 720;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  roundRect(ctx, px, py, pw, ph, 36);
  ctx.fillStyle = SKY;
  ctx.fill();
  ctx.restore();
  ctx.save();
  roundRect(ctx, px, py, pw, ph, 36);
  ctx.clip();
  if (photo) drawCover(ctx, photo, px, py, pw, ph);
  ctx.restore();
  // Cinta
  ctx.save();
  ctx.translate(W / 2, py + 4);
  ctx.rotate(-0.06);
  ctx.fillStyle = 'rgba(201, 219, 75, 0.75)';
  ctx.fillRect(-110, -26, 220, 52);
  ctx.restore();

  // Nombre y rol
  ctx.fillStyle = INK;
  ctx.textBaseline = 'alphabetic';
  // El nombre y el rol se achican solos si no caben (dejando espacio a las estrellas)
  const fit = (text, weight, size, family, maxWidth) => {
    let fontSize = size;
    ctx.font = `${weight} ${fontSize}px ${family}`;
    while (ctx.measureText(text).width > maxWidth && fontSize > 20) {
      fontSize -= 2;
      ctx.font = `${weight} ${fontSize}px ${family}`;
    }
  };
  fit(name, 500, 104, title, pw - 40);
  ctx.fillText(name, px, py + ph + 150);
  fit(role, 400, 48, body, pw - 190);
  ctx.fillStyle = '#555';
  ctx.fillText(role, px, py + ph + 222);
  ctx.font = `500 54px ${hand}`;
  ctx.fillStyle = ORANGE;
  ctx.fillText(place, px, py + ph + 300);

  star(ctx, W - 160, py + ph + 270, 40, LIME);
  star(ctx, W - 235, py + ph + 300, 22, ORANGE);
  star(ctx, W - 110, py + ph + 215, 20, SKY);

  // ─── Reverso ───
  const back = document.createElement('canvas');
  back.width = W;
  back.height = H;
  ctx = back.getContext('2d');
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  dots(ctx, W, H, 'rgba(255,255,255,0.08)');
  if (logo) {
    const lw = 460;
    const lh = (lw * (logo.naturalHeight || 1)) / (logo.naturalWidth || 1);
    ctx.save();
    ctx.filter = 'invert(1)';
    ctx.drawImage(logo, (W - lw) / 2, H / 2 - lh / 2 - 120, lw, lh);
    ctx.restore();
  }
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `500 96px ${title}`;
  ctx.fillText('LAB', W / 2, H / 2 + 170);
  ctx.font = `500 60px ${hand}`;
  ctx.fillStyle = PINK;
  ctx.fillText('computer-to-human translator', W / 2, H / 2 + 260);
  ctx.font = `400 40px ${body}`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(website, W / 2, H - 120);
  star(ctx, 170, 340, 40, LIME);
  star(ctx, W - 170, H - 300, 34, PINK);

  // ─── Cinta del lanyard (imagen horizontal que se repite a lo largo) ───
  const strap = document.createElement('canvas');
  strap.width = 1400;
  strap.height = 160;
  ctx = strap.getContext('2d');
  ctx.fillStyle = PINK;
  ctx.fillRect(0, 0, strap.width, strap.height);
  ctx.fillStyle = INK;
  ctx.font = `600 78px ${title}`;
  ctx.textBaseline = 'middle';
  const text = 'LAB';
  let x = 40;
  const colors = [LIME, SKY, ORANGE];
  let i = 0;
  while (x < strap.width) {
    ctx.fillStyle = INK;
    ctx.fillText(text, x, 86);
    x += ctx.measureText(text).width + 40;
    star(ctx, x + 24, 80, 30, colors[i++ % colors.length]);
    x += 100;
    ctx.fillStyle = INK;
    ctx.font = `400 58px ${body}`;
    ctx.fillText('product design', x, 84);
    x += ctx.measureText('product design').width + 40;
    star(ctx, x + 24, 80, 30, colors[i++ % colors.length]);
    x += 100;
    ctx.font = `600 78px ${title}`;
  }

  // Si la foto no deja exportar el canvas (CORS), usamos la foto directa
  const toUrl = (canvas, fallback) => {
    try {
      return canvas.toDataURL('image/png');
    } catch {
      return fallback;
    }
  };

  return {
    front: toUrl(front, photoUrl),
    back: toUrl(back, undefined),
    strap: toUrl(strap, undefined),
  };
}

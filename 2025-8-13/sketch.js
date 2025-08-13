// 花火の静止画描画 2025-08-13
// 1フレームのみ生成し、その後は止める

let generated = false;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  noLoop(); // draw は1回だけ
}

function draw() {
  if (generated) return;
  // randomSeed(130813); // 安定した再現性
  // noiseSeed(130813);
  background(210, 80, 5); // 夜空のベース (濃紺寄り)

  drawGradientSky();
  addSparseStars(260); // 星

  // 花火を複数配置
  const FIREWORKS = 6;
  for (let i = 0; i < FIREWORKS; i++) {
    const cx = random(width * 0.15, width * 0.85);
    const cy = random(height * 0.15, height * 0.55);
    const radius = random(min(width, height) * 0.18, min(width, height) * 0.33);
    const hueBase = random(0, 360);
    const ringCount = floor(random(2, 5));
    drawFirework(cx, cy, radius, hueBase, ringCount);
  }

  generated = true;
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function drawGradientSky() {
  noFill();
  for (let y = 0; y < height; y++) {
    const t = y / height;
    // 上は濃紺、下はやや紫
    const h = lerp(215, 250, pow(t, 1.2));
    const s = lerp(70, 50, t);
    const b = lerp(8, 18, t);
    stroke(h, s, b, 100);
    line(0, y, width, y);
  }
}

function addSparseStars(count) {
  strokeWeight(1);
  for (let i = 0; i < count; i++) {
    const x = random(width);
    const y = random(height * 0.85); // 下の方は控えめ
    const flicker = random();
    const b = 70 + flicker * 30;
    stroke(55, 10, b, 80 + flicker * 20);
    point(x, y);
    if (random() < 0.12) {
      // きらめきクロス
      push();
      strokeWeight(1);
      stroke(55, 5, b, 30);
      line(x - 2, y, x + 2, y);
      line(x, y - 2, x, y + 2);
      pop();
    }
  }
}

function drawFirework(cx, cy, baseR, hueBase, ringCount) {
  // 中心の閃光
  const coreHue = (hueBase + random(-10, 10) + 360) % 360;
  noStroke();
  for (let i = 0; i < 120; i++) {
    const ang = random(TWO_PI);
    const r = random(baseR * 0.05);
    const rr = r * r;
    const alpha = map(r, 0, baseR * 0.05, 90, 0);
    fill(coreHue, 80, 100, alpha);
    const x = cx + cos(ang) * r;
    const y = cy + sin(ang) * r;
    circle(x, y, 2 + random(1));
  }

  // 複数リング (内→外)
  for (let ring = 0; ring < ringCount; ring++) {
    const ringNorm = ring / (ringCount - 1 || 1);
    const ringR = lerp(baseR * 0.3, baseR, easeOutCubic(ringNorm));
    const particleCount = floor(lerp(80, 220, ringNorm) * random(0.9, 1.1));
    const hueShift = ring * random(12, 35) * (random() < 0.5 ? 1 : -1);
    const ringHue = (hueBase + hueShift + 360) % 360;

    for (let i = 0; i < particleCount; i++) {
      const ang = (i / particleCount) * TWO_PI + random(-0.015, 0.015);
      const spread = pow(random(), 0.6); // 密度を外側へ
      const jitterR = ringR * (1 + random(-0.015, 0.02));
      const r = jitterR * spread;
      const x = cx + cos(ang) * r;
      const y = cy + sin(ang) * r;

      // 色: 彩度と明度をばらつかせる
      const sat = 70 + random(-15, 10);
      const bri = 70 + random(20);

      // 外郭グロー（淡い）
      const glowLayers = 3;
      for (let g = glowLayers; g >= 1; g--) {
        const a = 15 * g + random(5);
        fill(ringHue, sat * 0.6, bri, a);
        circle(x, y, g * 4.5 * random(0.8, 1.2));
      }

      // 本体粒子
      fill(ringHue, sat, 100, 95);
      circle(x, y, random(2.2, 3.6));

      // スパーク (細い筋)
      if (random() < 0.08) {
        const len = random(baseR * 0.05, baseR * 0.12);
        const tailSteps = 5;
        for (let k = 0; k < tailSteps; k++) {
          const tt = k / tailSteps;
          const tx = x + cos(ang) * len * tt;
          const ty = y + sin(ang) * len * tt;
          fill(ringHue, sat * 0.8, 100, 80 * (1 - tt));
          circle(tx, ty, lerp(2.5, 0.3, tt));
        }
      }
    }
  }

  // 残光の煙 / 余韻 (淡い半透明ノイズ)
  push();
  noStroke();
  for (let i = 0; i < 300; i++) {
    const ang = random(TWO_PI);
    const r = random(baseR * 1.05);
    const falloff = pow(1 - r / (baseR * 1.05), 2.5);
    const x = cx + cos(ang) * r * random(0.9, 1.05);
    const y = cy + sin(ang) * r * random(0.9, 1.05);
    const a = 8 * falloff * random(0.4, 1);
    fill((hueBase + random(-20, 20) + 360) % 360, 30, 40, a);
    circle(x, y, random(4, 10));
  }
  pop();
}

function addVignette() {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x / width - 0.5;
      const dy = y / height - 0.5;
      const d = sqrt(dx * dx + dy * dy);
      const vig = smoothstep(0.6, 0.9, d); // 0→外側
      // RGB (HSB非直指定なのでRGB値直接減衰)
      pixels[idx + 0] *= 1 - vig * 0.55;
      pixels[idx + 1] *= 1 - vig * 0.55;
      pixels[idx + 2] *= 1 - vig * 0.55;
    }
  }
  updatePixels();
}

function easeOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generated = false;
  redraw();
}

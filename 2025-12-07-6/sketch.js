const CANVAS_W = 400;
const CANVAS_H = 400;
const BLOB_COUNT = 7;
const SPORE_COUNT = 80;
const PACK_ATTEMPTS = 6000;
const BLOB_PADDING = 18;

let blobs = [];
let spores = [];

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  angleMode(RADIANS);
  noStroke();

  generateBlobs();

  for (let i = 0; i < SPORE_COUNT; i++) {
    spores.push(createSpore());
  }
}

function draw() {
  drawGalaxyBackground();
  updateSpores();
  drawSpores();

  for (const blob of blobs) {
    blob.t += 0.01 + blob.wobbleSpeed;
    drawBlob(blob);
  }
}

// サークルパッキングで生物の位置を確保
function generateBlobs() {
  blobs = [];
  let tries = 0;
  while (blobs.length < BLOB_COUNT && tries < PACK_ATTEMPTS) {
    const candidate = createBlob();
    if (!isOverlapping(candidate, blobs)) {
      blobs.push(candidate);
    }
    tries++;
  }
}

// きもかわスライムの設定を作成
function createBlob() {
  const baseR = random(60, 110);
  return {
    x: random(baseR + BLOB_PADDING, width - baseR - BLOB_PADDING),
    y: random(baseR + BLOB_PADDING, height - baseR - BLOB_PADDING),
    baseR,
    hue: color(random(["#d5ff75", "#ffb3f0", "#88ffea", "#ffd966"])),
    eyeCount: floor(random(1, 4)),
    drool: random(0.3, 0.7),
    wobbleSpeed: random(0.003, 0.01),
    t: random(TWO_PI),
    safeR: baseR * 1.25,
  };
}

// 半径の和より近いかどうかで衝突を判定
function isOverlapping(candidate, others) {
  for (const other of others) {
    const dx = candidate.x - other.x;
    const dy = candidate.y - other.y;
    const minDist = candidate.safeR + other.safeR;
    if (dx * dx + dy * dy < minDist * minDist) {
      return true;
    }
  }
  return false;
}

// グロー背景
function drawGalaxyBackground() {
  push();
  noStroke();
  for (let i = 0; i < 8; i++) {
    const alpha = map(i, 0, 7, 220, 40);
    fill(25, 10, 46, alpha);
    rect(0, 0, width, height);
  }
  pop();
}

// 粘体をノイズ形状で描画
function drawBlob(blob) {
  push();
  translate(blob.x, blob.y);

  const breathing = map(sin(blob.t), -1, 1, 0.8, 1.15);
  const radius = blob.baseR * breathing;
  fill(red(blob.hue), green(blob.hue), blue(blob.hue), 210);

  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.2) {
    const noiseR = radius + noise(cos(a) + blob.t, sin(a) + blob.t) * 25;
    const x = cos(a) * noiseR;
    const y = sin(a) * noiseR;
    curveVertex(x, y);
  }
  endShape(CLOSE);

  drawEyes(blob, radius);
  drawDrool(blob, radius);
  pop();
}

// 眼球を複数配置
function drawEyes(blob, radius) {
  push();
  const eyeRadius = radius * 0.18;
  const spread = radius * 0.4;
  for (let i = 0; i < blob.eyeCount; i++) {
    const offset = map(i, 0, blob.eyeCount - 1, -spread / 2, spread / 2);
    const y = -radius * 0.1 + sin(blob.t * 2 + i) * 4;
    fill(255);
    ellipse(offset, y, eyeRadius * 1.6, eyeRadius * 1.3);
    fill(40, 20, 60);
    ellipse(
      offset + sin(frameCount * 0.05 + i) * eyeRadius * 0.2,
      y,
      eyeRadius * 0.6,
      eyeRadius * 0.75
    );
    fill(255, 220);
    ellipse(offset - 3, y - 3, eyeRadius * 0.25, eyeRadius * 0.22);
  }
  pop();
}

// どろっとしたよだれ
function drawDrool(blob, radius) {
  push();
  fill(255, 255, 255, 90);
  for (let i = 0; i < blob.eyeCount; i++) {
    const offset = map(i, 0, blob.eyeCount - 1, -radius * 0.3, radius * 0.3);
    const length = radius * blob.drool;
    beginShape();
    vertex(offset, radius * 0.4);
    vertex(offset + 6, radius * 0.4 + length * 0.3);
    bezierVertex(
      offset + 8,
      radius * 0.4 + length * 0.6,
      offset - 4,
      radius * 0.4 + length * 0.9,
      offset + 2,
      radius * 0.4 + length
    );
    vertex(offset - 4, radius * 0.4 + length);
    endShape(CLOSE);
  }
  pop();
}

// ふよふよ浮遊する胞子
function createSpore() {
  return {
    x: random(width),
    y: random(height),
    r: random(2, 6),
    speed: random(0.2, 0.6),
    phase: random(TWO_PI),
    tint: random(["#f7d4ff", "#ffe7a8", "#b0ffd8"]),
  };
}

function updateSpores() {
  for (const sp of spores) {
    sp.y -= sp.speed;
    sp.x += sin(frameCount * 0.01 + sp.phase) * 0.4;
    if (sp.y < -10) {
      sp.y = height + 10;
      sp.x = random(width);
    }
  }
}

function drawSpores() {
  push();
  noStroke();
  for (const sp of spores) {
    fill(color(sp.tint));
    ellipse(sp.x, sp.y, sp.r, sp.r);
    fill(255, 120);
    ellipse(sp.x - sp.r * 0.3, sp.y - sp.r * 0.3, sp.r * 0.4, sp.r * 0.4);
  }
  pop();
}

function keyPressed() {
  if (key === "s") {
    //saveCanvas(cnv, "canvas", "png");
    saveGif("canvas", 2);
  }
}

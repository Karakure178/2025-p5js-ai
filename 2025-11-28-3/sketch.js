// --- パレット ---
let palette = [
  "#ff8a80",
  "#ffd180",
  "#ffff8d",
  "#ccff90",
  "#80d8ff",
  "#b388ff",
  "#ff80ab",
];

let rects = [];

function setup() {
  createCanvas(800, 800);

  noLoop();

  generateNonOverlappingRects(10); // ★重ならない矩形を生成
}

function draw() {
  background("#fdf7f2");
  drawSubtleNoise(7000);

  push();

  for (const r of rects) {
    drawClippedPatternRect(r.cx, r.cy, r.w, r.h, r.angle, r.color, r.pattern);
  }

  pop();
}

/* -------------------------------------------------------
 * ★ 重ならないランダム矩形生成
 * ------------------------------------------------------ */
function generateNonOverlappingRects(count) {
  rects = [];
  let attempts = 0;
  const maxAttempts = 6000;

  while (rects.length < count && attempts < maxAttempts) {
    attempts++;

    let cx = random(width * 0.15, width * 0.85);
    let cy = random(height * 0.15, height * 0.85);
    let w = random(140, 260);
    let h = random(90, 200);
    let angle = random(-PI / 6, PI / 6);
    let color = random(palette);
    let pattern = floor(random(3));

    let candidate = { cx, cy, w, h, angle, color, pattern };

    // ★既存と重なっていたら捨てる
    let overlapped = rects.some((r) => rotatedRectOverlap(r, candidate));
    if (!overlapped) {
      rects.push(candidate);
    }
  }

  console.log("Rect count:", rects.length, "attempts:", attempts);
}

/* -------------------------------------------------------
 * ★ 回転矩形同士の当たり判定（OOBB）
 * ------------------------------------------------------ */
function rotatedRectOverlap(a, b) {
  const pa = getPolygon(a);
  const pb = getPolygon(b);
  return polygonsOverlap(pa, pb);
}

// 回転四角形の4頂点を返す
function getPolygon(r) {
  let hw = r.w / 2;
  let hh = r.h / 2;

  let pts = [
    createVector(-hw, -hh),
    createVector(hw, -hh),
    createVector(hw, hh),
    createVector(-hw, hh),
  ];

  for (let p of pts) {
    let rx = p.x * cos(r.angle) - p.y * sin(r.angle);
    let ry = p.x * sin(r.angle) + p.y * cos(r.angle);
    p.x = rx + r.cx;
    p.y = ry + r.cy;
  }
  return pts;
}

// SAT によるポリゴン重なりチェック
function polygonsOverlap(polyA, polyB) {
  return !(hasSeparatingAxis(polyA, polyB) || hasSeparatingAxis(polyB, polyA));
}

// ポリゴンの辺に対し投影して分離軸があるか確認
function hasSeparatingAxis(polyA, polyB) {
  for (let i = 0; i < polyA.length; i++) {
    let p1 = polyA[i];
    let p2 = polyA[(i + 1) % polyA.length];
    let edge = p5.Vector.sub(p2, p1);

    let axis = createVector(-edge.y, edge.x);
    axis.normalize();

    let [minA, maxA] = projectPolygon(polyA, axis);
    let [minB, maxB] = projectPolygon(polyB, axis);

    if (maxA < minB || maxB < minA) {
      return true; // 分離軸がある → 重なってない
    }
  }
  return false;
}

function projectPolygon(poly, axis) {
  let min = p5.Vector.dot(poly[0], axis);
  let max = min;
  for (let p of poly) {
    let v = p5.Vector.dot(p, axis);
    min = Math.min(min, v);
    max = Math.max(max, v);
  }
  return [min, max];
}

/* -------------------------------------------------------
 * クリップした矩形＋パターン
 * ------------------------------------------------------ */
function drawClippedPatternRect(cx, cy, w, h, angle, baseColor, patternType) {
  push();
  translate(cx, cy);
  rotate(angle);

  const ctx = drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.rect(-w / 2, -h / 2, w, h);
  ctx.clip();

  // 濃い線色
  let strokeCol = color(baseColor);
  strokeCol.setRed(red(strokeCol) * 0.7);
  strokeCol.setGreen(green(strokeCol) * 0.7);
  strokeCol.setBlue(blue(strokeCol) * 0.7);
  stroke(strokeCol);
  strokeWeight(1.5);

  // パターン選択
  if (patternType === 0) drawWavePattern(w, h);
  if (patternType === 1) drawDotPattern(w, h);
  if (patternType === 2) drawHatchingPattern(w, h);

  ctx.restore();
  pop();
}

/* -------------------------------------------------------
 * パターン描画
 * ------------------------------------------------------ */
function drawWavePattern(w, h) {
  let gap = 9;
  let amp = 8;
  let freq = 0.04;

  noFill();
  for (let y = -h / 2 - amp; y <= h / 2 + amp; y += gap) {
    let phase = random(TWO_PI);
    beginShape();
    for (let x = -w / 2 - amp; x <= w / 2 + amp; x += 7) {
      vertex(x, y + sin(x * freq + phase) * amp);
    }
    endShape();
  }
}

function drawDotPattern(w, h) {
  let step = 18;
  noStroke();
  for (let y = -h / 2; y <= h / 2; y += step) {
    for (let x = -w / 2; x <= w / 2; x += step) {
      fill(0, 30);
      circle(x + random(-2, 2), y + random(-2, 2), random(3, 7));
    }
  }
}

function drawHatchingPattern(w, h) {
  let gap = 10;
  strokeWeight(1.2);
  for (let x = -w; x <= w; x += gap) {
    line(x - h, -h, x + h, h);
  }
  strokeWeight(2.2);
  for (let i = 0; i < 4; i++) {
    let x = random(-w, w);
    line(x - h, -h, x + h, h);
  }
}

/* -------------------------------------------------------
 * 背景ノイズ
 * ------------------------------------------------------ */
function drawSubtleNoise(count) {
  push();
  stroke(0, 10);
  strokeWeight(2);
  for (let i = 0; i < count; i++) {
    point(random(width), random(height));
  }
  pop();
}

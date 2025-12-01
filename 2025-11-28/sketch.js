// 六角形を格納する配列
let hexagons = [];

function setup() {
  createCanvas(800, 800);
  noLoop(); // 1枚絵

  generateNonOverlappingHexagons(8); // 重ならない六角形を8個つくる
}

function draw() {
  background(255);

  stroke(0);
  noFill();

  for (const hex of hexagons) {
    // 外枠（六角形）
    drawHexagon(hex.x, hex.y, hex.radius);
    // 中を波線で充填
    drawWavyHexagon(hex.x, hex.y, hex.radius, 8, 10, 0.15, hex.seed);
  }
}

/**
 * 六角形を描画する関数
 * @param {number} x 中心X座標
 * @param {number} y 中心Y座標
 * @param {number} radius 半径
 */
function drawHexagon(x, y, radius) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i - HALF_PI;
    let vx = x + cos(angle) * radius;
    let vy = y + sin(angle) * radius;
    vertex(vx, vy);
  }
  endShape(CLOSE);
}

/**
 * 重ならない六角形を複数生成
 * @param {number} count 生成したい個数
 */
function generateNonOverlappingHexagons(count) {
  hexagons = [];
  const marginFromEdge = 80; // キャンバス端からの余白
  const paddingBetween = 20; // 六角形同士の最小距離

  let attempts = 0;
  const maxAttempts = 5000; // 無限ループ防止

  while (hexagons.length < count && attempts < maxAttempts) {
    attempts++;

    let radius = random(60, 120);
    let x = random(marginFromEdge, width - marginFromEdge);
    let y = random(marginFromEdge, height - marginFromEdge);
    let seed = random(10000);

    const candidate = { x, y, radius, seed };

    // 既存の六角形と重なっていないかチェック
    let overlapped = false;
    for (const hex of hexagons) {
      if (hexagonsOverlap(hex, candidate, paddingBetween)) {
        overlapped = true;
        break;
      }
    }

    if (!overlapped) {
      hexagons.push(candidate);
    }
  }

  console.log("Generated hexagons:", hexagons.length, "attempts:", attempts);
}

/**
 * 六角形の重なり判定（中心間の距離で判定）
 * @param {Object} a {x, y, radius}
 * @param {Object} b {x, y, radius}
 * @param {number} padding 六角形同士の最小距離
 * @returns {boolean} 重なっていれば true
 */
function hexagonsOverlap(a, b, padding) {
  let distance = dist(a.x, a.y, b.x, b.y);
  let minDistance = a.radius + b.radius + padding;
  return distance < minDistance;
}

/**
 * 六角形の中を波線でいっぱいに埋める関数
 * @param {number} cx 六角形中心X
 * @param {number} cy 六角形中心Y
 * @param {number} radius 六角形の半径
 * @param {number} lineGap 波線同士の間隔
 * @param {number} amp 波の振幅（高さ）
 * @param {number} freq 波の細かさ（周波数）
 * @param {number} seed ランダムシード（波のバリエーション用）
 */
function drawWavyHexagon(cx, cy, radius, lineGap, amp, freq, seed) {
  push();

  const ctx = drawingContext;
  ctx.save();

  // 六角形でクリッピング
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i - HALF_PI;
    let vx = cx + cos(angle) * radius;
    let vy = cy + sin(angle) * radius;
    if (i === 0) {
      ctx.moveTo(vx, vy);
    } else {
      ctx.lineTo(vx, vy);
    }
  }
  ctx.closePath();
  ctx.clip();

  noFill();
  stroke(0);

  randomSeed(seed);

  // 六角形を包含する矩形範囲で波線を描画
  let minY = cy - radius - amp;
  let maxY = cy + radius + amp;
  let minX = cx - radius - amp;
  let maxX = cx + radius + amp;

  for (let yy = minY; yy <= maxY; yy += lineGap) {
    let phase = random(TWO_PI);

    beginShape();
    for (let xx = minX; xx <= maxX; xx += 8) {
      let yOffset = sin(xx * freq + phase) * amp;
      vertex(xx, yy + yOffset);
    }
    endShape();
  }

  ctx.restore();
  pop();
}

// キーボード入力でキャンバスを保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("hexagon-wavy", "png");
  }
}

// 幾何タイル入れ替えアニメーション
// padding 強め & 既存タイル(0〜4)＋クリップタイル(5) 版
// ★ タイプ5の円弧が四角からはみ出さないよう rect で clip しています

const GRID = 6; // 6x6 グリッド
let artSize;
let cellSize;
let offsetX, offsetY;

// グリッド間の余白量（0.0〜1.0）
const PADDING_RATIO = 0.2; // 余白をしっかり確保

// 落ち着いた大人かわいいパレット
const palette = [
  "#5C4D7D", // smokey lavender
  "#8FB7B3", // sage mint
  "#F1DDE1", // soft blush
  "#FDD6A7", // warm peach
  "#D28E8E", // dusty rose
  "#FFF4E6", // milk cream
];

let tiles = [];

function setup() {
  createCanvas(800, 800);
  noStroke();
  angleMode(RADIANS);

  artSize = min(width, height) * 0.8;
  cellSize = artSize / GRID;
  offsetX = (width - artSize) / 2 + cellSize / 2;
  offsetY = (height - artSize) / 2 + cellSize / 2;

  for (let j = 0; j < GRID; j++) {
    for (let i = 0; i < GRID; i++) {
      tiles.push(createTile(i, j));
    }
  }
}

function draw() {
  background("#F8EEE6"); // 柔らかいピンクベージュ地

  for (let t of tiles) {
    updateTile(t);
    drawTile(t);
  }

  // シュパッと頻度高めにランダムで入れ替え
  if (frameCount % 12 === 0) {
    for (let k = 0; k < 2; k++) {
      let candidate = random(tiles);
      if (!candidate.isAnimating) startTransition(candidate);
    }
  }
}

// ===== タイル構造体生成 =====
function createTile(i, j) {
  let x = offsetX + i * cellSize;
  let y = offsetY + j * cellSize;

  // 既存タイル(0〜4) + 新クリップタイル(5) をミックス
  let r = random();
  let type;
  if (r < 0.25) {
    type = 3; // 円＋円弧
  } else if (r < 0.5) {
    type = 4; // 左上ブロック＋斜め円
  } else if (r < 0.75) {
    type = 5; // ★ クリップタイル
  } else {
    type = floor(random(3)); // 0,1,2
  }

  let colA = random(palette);
  let colB = random(palette);
  while (colB === colA) colB = random(palette);

  let colC = random(palette);
  while (colC === colA || colC === colB) colC = random(palette);

  return {
    i,
    j,
    x,
    y,
    size: cellSize * (1 - PADDING_RATIO), // padding を反映
    type, // 0〜5
    rot: floor(random(4)), // 0〜3 (90度刻み)
    colA,
    colB,
    colC,
    isAnimating: false,
    t: 0,
    next: null,
  };
}

// ===== 更新 =====
function updateTile(tile) {
  if (!tile.isAnimating) return;

  tile.t += 0.12; // 速め（シュパッと）

  if (tile.t >= 1) {
    tile.type = tile.next.type;
    tile.rot = tile.next.rot;
    tile.colA = tile.next.colA;
    tile.colB = tile.next.colB;
    tile.colC = tile.next.colC;

    tile.isAnimating = false;
    tile.t = 0;
    tile.next = null;
  }
}

// ===== 描画 =====
function drawTile(tile) {
  push();
  translate(tile.x, tile.y);

  if (!tile.isAnimating) {
    drawTileShape(
      tile.type,
      tile.size,
      tile.rot,
      tile.colA,
      tile.colB,
      tile.colC,
      1,
      1
    );
  } else {
    let e = easeInOutCubic(tile.t);

    // シュパッと縮んでからパッと出る
    let oldScale = 1 - 0.5 * e;
    let newScale = 0.5 + 0.5 * e;

    // 少し回転も入れる
    let rotAnim = (e - 0.5) * 0.25;

    push();
    rotate(rotAnim);
    drawTileShape(
      tile.type,
      tile.size,
      tile.rot,
      tile.colA,
      tile.colB,
      tile.colC,
      oldScale,
      1 - e
    );
    pop();

    push();
    rotate(rotAnim + 0.15);
    drawTileShape(
      tile.next.type,
      tile.size,
      tile.next.rot,
      tile.next.colA,
      tile.next.colB,
      tile.next.colC,
      newScale,
      e
    );
    pop();
  }

  pop();
}

// ===== 入れ替え開始 =====
function startTransition(tile) {
  let r = random();
  let nType;
  if (r < 0.25) {
    nType = 3;
  } else if (r < 0.5) {
    nType = 4;
  } else if (r < 0.75) {
    nType = 5;
  } else {
    nType = floor(random(3));
  }

  let nColA = random(palette);
  let nColB = random(palette);
  while (nColB === nColA) nColB = random(palette);

  let nColC = random(palette);
  while (nColC === nColA || nColC === nColB) nColC = random(palette);

  tile.next = {
    type: nType,
    rot: floor(random(4)),
    colA: nColA,
    colB: nColB,
    colC: nColC,
  };

  tile.isAnimating = true;
  tile.t = 0;
}

// ===== タイル形状 =====
function drawTileShape(
  type,
  size,
  rotStep,
  colA,
  colB,
  colC,
  scaleFactor,
  alpha
) {
  let s = size * scaleFactor;

  push();
  rotate(rotStep * HALF_PI);

  // 下地（角丸スクエア）
  let cb = color(colB);
  cb.setAlpha(alpha * 255);
  fill(cb);
  rectMode(CENTER);
  rect(0, 0, s, s);

  let ca = color(colA);
  ca.setAlpha(alpha * 255);
  noStroke();

  switch (type) {
    case 0: {
      // ハーフサークル＋細いハイライト
      fill(ca);
      arc(0, 0, s * 0.98, s * 0.98, PI, 0, PIE);

      let cLine0 = color(colC);
      cLine0.setAlpha(alpha * 220);
      fill(cLine0);
      rect(0, s * 0.05, s * 0.9, s * 0.08);
      break;
    }

    case 1: {
      // コーナーのクォーターサークル＋縦ライン
      fill(ca);
      let r1 = s * 0.4;
      let cx = -s * 0.5 + r1;
      let cy = -s * 0.5 + r1;
      arc(cx, cy, r1 * 2, r1 * 2, 0, HALF_PI, PIE);

      let cMid = color(colC);
      cMid.setAlpha(alpha * 200);
      fill(cMid);
      rect(0, 0, s * 0.12, s * 0.9, s * 0.06);
      break;
    }

    case 2: {
      // 葉っぱ / しずく楕円＋丸
      fill(ca);
      push();
      rotate(-PI / 6);
      ellipse(0, 0, s * 0.8, s * 0.55);
      pop();

      let cInner = color(colC);
      cInner.setAlpha(alpha * 240);
      fill(cInner);
      circle(0, 0, s * 0.3);
      break;
    }

    case 3: {
      // 円＋円弧パターン
      let baseR = s * 0.45;

      push();
      fill(ca);
      strokeWeight(6);
      stroke(ca);
      circle(0, 0, baseR * 2);
      pop();

      let cArc = color(colC);
      cArc.setAlpha(alpha * 240);
      fill(cArc);

      let startAng = -PI / 3;
      let endAng = (4 * PI) / 3;
      arc(0, 0, baseR * 2, baseR * 2, startAng, endAng, PIE);
      break;
    }

    case 4: {
      break;
    }

    case 5: {
      // クリップタイル：四角形の中に収まる1/4円の連なり
      let ctx = drawingContext;
      ctx.save();
      ctx.beginPath();
      ctx.rect(-s * 0.5, -s * 0.5, s, s);
      ctx.clip();

      fill(ca);
      arc(-s * 0.5, s * 0.5, s * 2.0, s * 2.0, -HALF_PI, 0, PIE);

      let cInnerArc = color(colC);
      cInnerArc.setAlpha(alpha * 255);
      fill(cInnerArc);
      arc(-s * 0.5, s * 0.5, s * 1.4, s * 1.4, -HALF_PI, 0, PIE);

      ctx.restore();
      break;
    }
  }

  noFill();
  strokeWeight(3);
  stroke(180, 150, 160, 180);
  rect(0, 0, s, s);

  pop();
}

// ===== イージング =====
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

keyPressed = () => {
  if (key === "s") {
    //saveCanvas(canvas, "canvas", "png");
    saveGif("canvas", 2);
  }
};

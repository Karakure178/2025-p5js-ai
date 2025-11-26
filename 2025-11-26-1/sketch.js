// 棒針編みの編み図

let patternSize = 7; // 模様のサイズ（7×7）
let cellSize = 30; // 各マスのサイズ
let repeatX = 4; // 横の繰り返し回数
let repeatY = 4; // 縦の繰り返し回数

// 複数の7×7模様パターン（0:表編み, 1:裏編み）
let patterns = [
  // パターン1: ダイヤモンド
  [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ],
  // パターン2: クロス
  [
    [1, 0, 0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 1],
  ],
  // パターン3: チェッカー
  [
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1],
  ],
  // パターン4: ハート
  [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ],
  // パターン5: フレーム
  [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ],
];

// 各位置にランダムに選ばれた模様を保存
let selectedPatterns = [];

function setup() {
  const canvas = createCanvas(
    patternSize * cellSize * repeatX,
    patternSize * cellSize * repeatY
  );
  canvas.parent("canvas-container");

  // 各位置にランダムな模様を選択
  for (let rx = 0; rx < repeatX; rx++) {
    selectedPatterns[rx] = [];
    for (let ry = 0; ry < repeatY; ry++) {
      selectedPatterns[rx][ry] = floor(random(patterns.length));
    }
  }

  noLoop(); // 静止画
}

function draw() {
  background(255);

  // 模様を繰り返し描画
  for (let rx = 0; rx < repeatX; rx++) {
    for (let ry = 0; ry < repeatY; ry++) {
      let patternIndex = selectedPatterns[rx][ry];
      drawPattern(
        rx * patternSize * cellSize,
        ry * patternSize * cellSize,
        patterns[patternIndex]
      );
    }
  }

  // グリッド線を描画
  drawGrid();
}

// 7×7の模様を描画する関数
function drawPattern(offsetX, offsetY, pattern) {
  for (let i = 0; i < patternSize; i++) {
    for (let j = 0; j < patternSize; j++) {
      let x = offsetX + i * cellSize;
      let y = offsetY + j * cellSize;

      if (pattern[j][i] === 0) {
        // 表編み（白）
        drawFrontStitch(x, y);
      } else {
        // 裏編み（グレー）
        drawBackStitch(x, y);
      }
    }
  }
}

// 表編みの記号を描画
function drawFrontStitch(x, y) {
  fill(255);
  stroke(0);
  strokeWeight(1);
  rect(x, y, cellSize, cellSize);

  // 中央に縦線
  stroke(100);
  line(x + cellSize / 2, y + 5, x + cellSize / 2, y + cellSize - 5);
}

// 裏編みの記号を描画
function drawBackStitch(x, y) {
  fill(220);
  stroke(0);
  strokeWeight(1);
  rect(x, y, cellSize, cellSize);

  // 中央に横線
  stroke(80);
  line(x + 5, y + cellSize / 2, x + cellSize - 5, y + cellSize / 2);
}

// グリッド線を描画
function drawGrid() {
  stroke(150);
  strokeWeight(2);

  // 模様の区切り線（太線）
  for (let i = 0; i <= repeatX; i++) {
    let x = i * patternSize * cellSize;
    line(x, 0, x, height);
  }

  for (let j = 0; j <= repeatY; j++) {
    let y = j * patternSize * cellSize;
    line(0, y, width, y);
  }
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("knitting-pattern", "png");
  }
}

// 模様編みのパターン図
// 棒針編みの記号を使った編み図

let cellSize = 5; // 各マスのサイズ
let cols = 90; // 列数
let rows = 90; // 行数
let pattern = []; // パターンデータ

// 棒針編み記号の種類（二色編み込み）
const SYMBOLS = {
  COLOR1: 0, // 色1（黒）
  COLOR2: 1, // 色2（白）
};

// 色設定
const colors = {
  bg: "#F5F5F5", // 明るいグレー背景
  grid: "#CCCCCC", // グレーグリッド
  color1: "#000000", // 黒
  color2: "#FFFFFF", // 白
};

function setup() {
  const c = createCanvas(900, 900);
  c.parent("canvas-container");

  // パターンを生成
  generatePattern();

  noLoop();
}

// 編み図パターンを生成（2色の美しい模様）
function generatePattern() {
  pattern = [];

  const centerR = rows / 2;
  const centerC = cols / 2;

  for (let r = 0; r < rows; r++) {
    pattern[r] = [];
    for (let c = 0; c < cols; c++) {
      const dx = c - centerC;
      const dy = r - centerR;
      const distance = sqrt(dx * dx + dy * dy);
      const angle = atan2(dy, dx);

      // 黄金比スパイラル風のパターン
      const phi = 1.618033988749;
      const spiral = (angle + distance * 0.4) % ((PI * 2) / phi);

      // 曼茶羅風の放射状パターン
      const mandala1 = abs(sin(angle * 8)) > 0.7;
      const mandala2 = abs(cos(angle * 12 + distance * 0.3)) > 0.8;

      // 同心円のリズム
      const rings = floor(distance) % 4 === 0 || floor(distance) % 4 === 1;

      // 花弁風のパターン
      const petal = sin(angle * 6 + distance * 0.5) > 0.3;

      // 複雑な幾何学模様
      const complex = (mandala1 || mandala2) && distance < 14;

      // フィボナッチ数列風の分割
      const fib =
        floor((angle * 13) / PI) % 2 === 0 && floor(distance) % 3 === 0;

      // パターンを組み合わせて美しい模様を作る
      if (complex) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (rings && petal) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (fib) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (spiral < 1.0) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else {
        pattern[r][c] = SYMBOLS.COLOR2;
      }

      // 中心のダイヤモンド
      const manhattanDist = abs(dx) + abs(dy);
      if (manhattanDist < 3) {
        pattern[r][c] = SYMBOLS.COLOR1;
      }

      // 外側のボーダー
      if (
        distance > 13.5 &&
        distance < 14.5 &&
        floor((angle * 24) / PI) % 2 === 0
      ) {
        pattern[r][c] = SYMBOLS.COLOR1;
      }
    }
  }
}

function draw() {
  background(colors.bg);

  // グリッドとパターンを描画（中央に配置）
  push();
  const gridWidth = cols * cellSize;
  const gridHeight = rows * cellSize;
  const x = (width - gridWidth) / 2;
  const y = (height - gridHeight) / 2;
  translate(x, y);
  drawPattern();
  drawGrid();
  pop();
}

// グリッドを描画
function drawGrid() {
  stroke(colors.grid);
  strokeWeight(1);

  // 縦線
  for (let c = 0; c <= cols; c++) {
    line(c * cellSize, 0, c * cellSize, rows * cellSize);
  }

  // 横線
  for (let r = 0; r <= rows; r++) {
    line(0, r * cellSize, cols * cellSize, r * cellSize);
  }
}

// パターンを描画
function drawPattern() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellSize + cellSize / 2;
      const y = r * cellSize + cellSize / 2;

      // 三色の色分け
      let fillColor;
      if (pattern[r][c] === SYMBOLS.COLOR1) {
        fillColor = colors.color1;
      } else if (pattern[r][c] === SYMBOLS.COLOR2) {
        fillColor = colors.color2;
      } else {
        fillColor = colors.color3;
      }

      fill(fillColor);
      noStroke();
      square(x - cellSize / 2, y - cellSize / 2, cellSize);
    }
  }
}

// クリックでパターン再生成
function mousePressed() {
  generatePattern();
  redraw();
}

// キー操作
function keyPressed() {
  if (key === "r" || key === "R") {
    generatePattern();
    redraw();
  }
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

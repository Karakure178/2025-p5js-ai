// 模様編みのパターン図
// 棒針編みの記号を使った編み図

let cellSize = 20; // 各マスのサイズ
let cols = 30; // 列数
let rows = 30; // 行数
let pattern = []; // パターンデータ

// 棒針編み記号の種類（三色編み込み）
const SYMBOLS = {
  COLOR1: 0, // 色1（メインカラー）
  COLOR2: 1, // 色2（青）
  COLOR3: 2, // 色3（黄色）
};

// 色設定
const colors = {
  bg: "#0A0E27", // 深い青背景
  grid: "#1A1F3A", // 暗いグリッド
  color1: "#FF006E", // マゼンタ
  color2: "#8338EC", // 紫
  color3: "#3A86FF", // 青
};

function setup() {
  const c = createCanvas(900, 900);
  c.parent("canvas-container");

  // パターンを生成
  generatePattern();

  noLoop();
}

// 編み図パターンを生成（クリエイティブコーディング風）
function generatePattern() {
  pattern = [];

  const centerR = rows / 2;
  const centerC = cols / 2;
  const noiseScale = 0.15; // ノイズのスケール
  const timeOffset = random(1000); // ランダムなオフセット

  for (let r = 0; r < rows; r++) {
    pattern[r] = [];
    for (let c = 0; c < cols; c++) {
      // 中心からの距離と角度
      const dx = c - centerC;
      const dy = r - centerR;
      const distance = sqrt(dx * dx + dy * dy);
      const angle = atan2(dy, dx);

      // 複数の波を組み合わせる
      const wave1 = sin(angle * 3 + distance * 0.3);
      const wave2 = cos(angle * 5 - distance * 0.2);
      const wave3 = sin(distance * 0.4 + angle * 2);

      // ノイズを追加して有機的に
      const n = noise(
        c * noiseScale + timeOffset,
        r * noiseScale,
        distance * 0.1
      );

      // 複合値を計算
      const value = (wave1 + wave2 + wave3) / 3 + (n - 0.5) * 0.5;

      // 値によって色を分ける
      if (value > 0.3) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (value > -0.1) {
        pattern[r][c] = SYMBOLS.COLOR2;
      } else {
        pattern[r][c] = SYMBOLS.COLOR3;
      }

      // 同心円パターンを追加
      if (floor(distance) % 8 === 0) {
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

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
  bg: "#2D4356", // 深い青背景
  grid: "#1A1F3A", // 暗いグリッド
  color1: "#435B66",
  color2: "#A76F6F",
  color3: "#EAB2A0",
};

function setup() {
  const c = createCanvas(900, 900);
  c.parent("canvas-container");

  // パターンを生成
  generatePattern();

  noLoop();
}

// 編み図パターンを生成（飛び跳ねた感じのクリエイティブコーディング風）
function generatePattern() {
  pattern = [];

  const centerR = rows / 2;
  const centerC = cols / 2;
  const noiseScale = 0.25; // ノイズを強く
  const timeOffset = random(1000);

  for (let r = 0; r < rows; r++) {
    pattern[r] = [];
    for (let c = 0; c < cols; c++) {
      const dx = c - centerC;
      const dy = r - centerR;
      const distance = sqrt(dx * dx + dy * dy);
      const angle = atan2(dy, dx);

      // より激しい波を生成
      const wave1 = sin(angle * 7 + distance * 0.8);
      const wave2 = cos(angle * 11 - distance * 0.5);
      const wave3 = sin(distance * 0.9 + angle * 4);
      const wave4 = cos(angle * 13 + distance * 1.2);

      // 強いノイズ
      const n1 = noise(c * noiseScale + timeOffset, r * noiseScale);
      const n2 = noise(c * noiseScale * 2, r * noiseScale * 2, distance * 0.3);

      // 複合値（より変動的に）
      const value =
        (wave1 + wave2 + wave3 + wave4) / 4 +
        (n1 - 0.5) * 1.2 +
        (n2 - 0.5) * 0.8;

      // スパイク的なパターン
      const spike = sin(c * 0.7) * cos(r * 0.7) > 0.7;

      // より激しい色分け
      if (spike || value > 0.6) {
        pattern[r][c] = SYMBOLS.COLOR3;
      } else if (value > 0.2) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (value > -0.3) {
        pattern[r][c] = SYMBOLS.COLOR2;
      } else {
        pattern[r][c] = SYMBOLS.COLOR3;
      }

      // ランダムなスポット
      if (random() > 0.95) {
        pattern[r][c] = SYMBOLS.COLOR3;
      }

      // 不規則な同心円
      if (floor(distance + noise(angle * 3) * 5) % 6 === 0) {
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

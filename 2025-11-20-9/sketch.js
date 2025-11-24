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
  bg: "#0D3B2E", // 深い緑背景
  grid: "#1A1F3A", // 暗いグリッド
  color1: "#C41E3A", // クリスマスレッド
  color2: "#165B33", // クリスマスグリーン
  color3: "#FFD700", // ゴールド
};

function setup() {
  const c = createCanvas(900, 900);
  c.parent("canvas-container");

  // パターンを生成
  generatePattern();

  noLoop();
}

// 編み図パターンを生成（クリスマスデザイン）
function generatePattern() {
  pattern = [];

  const centerR = rows / 2;
  const centerC = cols / 2;
  const noiseScale = 0.2;
  const timeOffset = random(1000);

  // 背景を緑で初期化
  for (let r = 0; r < rows; r++) {
    pattern[r] = [];
    for (let c = 0; c < cols; c++) {
      pattern[r][c] = SYMBOLS.COLOR2;
    }
  }

  // 雪の結晶パターンを追加
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = c - centerC;
      const dy = r - centerR;
      const distance = sqrt(dx * dx + dy * dy);
      const angle = atan2(dy, dx);

      // 6角形の雪の結晶パターン
      const snowflake = abs(sin(angle * 6)) > 0.9 && distance < 12;

      // 放射状のパターン
      const radial = floor((angle * 6) / PI) % 2 === 0 && distance < 10;

      // 星のようなパターン
      const star =
        abs(sin(angle * 5 + distance * 0.5)) > 0.85 &&
        distance > 8 &&
        distance < 15;

      // ノイズで雪のランダム性
      const n = noise(c * noiseScale + timeOffset, r * noiseScale);

      // クリスマスツリーの形（上に行くほど狭く）
      const treeWidth = (rows - r) * 0.4;
      const isTree = abs(dx) < treeWidth && r < rows - 5;

      if (snowflake || radial) {
        pattern[r][c] = SYMBOLS.COLOR3; // 金色の結晶
      } else if (star) {
        pattern[r][c] = SYMBOLS.COLOR1; // 赤い星
      } else if (isTree && n > 0.6) {
        pattern[r][c] = SYMBOLS.COLOR1; // ツリーのオーナメント
      } else if (isTree && n > 0.4) {
        pattern[r][c] = SYMBOLS.COLOR3; // 金のオーナメント
      }

      // ランダムな雪の粉
      if (random() > 0.97) {
        pattern[r][c] = SYMBOLS.COLOR3;
      }

      // 中心に星
      if (distance < 3) {
        pattern[r][c] = SYMBOLS.COLOR3;
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

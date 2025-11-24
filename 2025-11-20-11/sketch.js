// 模様編みのパターン図
// 棒針編みの記号を使った編み図

let cellSize = 20; // 各マスのサイズ
let cols = 30; // 列数
let rows = 30; // 行数
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

// 編み図パターンを生成（抽象的な模様）
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

      // 抽象的な波動パターン
      const wave1 = sin(distance * 0.8 - angle * 3);
      const wave2 = cos(distance * 0.5 + angle * 5);
      const wave3 = sin(angle * 8 - distance * 0.3);

      // 複合波による抽象表現
      const abstractValue = (wave1 + wave2 + wave3) / 3;

      // 螺旋状の流れ
      const spiralFlow = sin(angle * 7 + distance * 0.6 + wave1 * 2);

      // 干渉パターン（モアレ効果）
      const interference = sin(c * 0.6) * cos(r * 0.6) + sin(distance * 0.7);

      // 有機的な境界線
      const organicBorder = abs(distance - 10 - wave1 * 3) < 1.5;

      // フラクタル的な密度
      const fractal = sin(angle * 13) * cos(distance * 0.9) > 0.4;

      // 複数の要素を統合して抽象的な模様を浮かび上がらせる
      const combinedValue =
        abstractValue + spiralFlow * 0.5 + interference * 0.3;

      if (organicBorder) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (combinedValue > 0.5 && fractal) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (combinedValue > 0.7) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (spiralFlow > 0.6 && distance < 12) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else if (interference > 0.8) {
        pattern[r][c] = SYMBOLS.COLOR1;
      } else {
        pattern[r][c] = SYMBOLS.COLOR2;
      }

      // 中心の焦点
      if (distance < 2) {
        pattern[r][c] = SYMBOLS.COLOR1;
      }

      // 外側の抽象的なフレーム
      if (distance > 14 && sin(angle * 11 + distance) > 0.5) {
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

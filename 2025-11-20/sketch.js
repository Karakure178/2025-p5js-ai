// 模様編みのパターン図
// 棒針編みの記号を使った編み図

let cellSize = 30; // 各マスのサイズ
let cols = 20; // 列数
let rows = 20; // 行数
let pattern = []; // パターンデータ

// 棒針編み記号の種類
const SYMBOLS = {
  KNIT: 0, // 表目（空白マス）
  PURL: 1, // 裏目（・）
  YO: 2, // かけ目（○）
  K2TOG: 3, // 右上2目一度（/）
  SSK: 4, // 左上2目一度（\）
  SLIP: 5, // すべり目（V）
  EMPTY: 6, // 空白
};

// 色設定
const colors = {
  bg: "#FFFEF7", // 背景色（紙のような色）
  grid: "#E0E0E0", // グリッド線
  symbol: "#2C3E50", // 記号の色
  accent: "#E74C3C", // アクセント色
};

function setup() {
  const c = createCanvas(800, 800);
  c.parent("canvas-container");

  // パターンを生成
  generatePattern();

  noLoop();
}

// 編み図パターンを生成
function generatePattern() {
  pattern = [];

  // シンプルな模様編みパターンを作成（レース編み風ダイヤモンド模様）
  for (let r = 0; r < rows; r++) {
    pattern[r] = [];
    for (let c = 0; c < cols; c++) {
      const centerR = rows / 2;
      const centerC = cols / 2;
      const distFromCenter = abs(r - centerR) + abs(c - centerC);

      if (distFromCenter % 6 === 0) {
        pattern[r][c] = SYMBOLS.YO; // かけ目（穴を作る）
      } else if (distFromCenter % 6 === 3) {
        pattern[r][c] = SYMBOLS.YO; // かけ目
      } else if ((r + c) % 3 === 0) {
        pattern[r][c] = SYMBOLS.PURL; // 裏目
      } else if (distFromCenter % 4 === 1 && c < centerC) {
        pattern[r][c] = SYMBOLS.SSK; // 左上2目一度
      } else if (distFromCenter % 4 === 1 && c > centerC) {
        pattern[r][c] = SYMBOLS.K2TOG; // 右上2目一度
      } else {
        pattern[r][c] = SYMBOLS.KNIT; // 表目
      }
    }
  }
}

function draw() {
  background(colors.bg);

  // タイトル
  drawTitle();

  // グリッドとパターンを描画
  push();
  translate(50, 100);
  drawGrid();
  drawPattern();
  pop();

  // 凡例を描画
  drawLegend();
}

// タイトル描画
function drawTitle() {
  fill(colors.symbol);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text("模様編みパターン図", width / 2, 40);

  textSize(14);
  fill(100);
  text("ダイヤモンド模様", width / 2, 65);
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
      drawSymbol(x, y, pattern[r][c]);
    }
  }
}

// 各編み記号を描画
function drawSymbol(x, y, symbolType) {
  push();
  translate(x, y);

  switch (symbolType) {
    case SYMBOLS.KNIT: // 表目（空白マス - 何も描かない）
      break;

    case SYMBOLS.PURL: // 裏目（・または−）
      fill(colors.symbol);
      noStroke();
      ellipse(0, 0, cellSize * 0.2);
      break;

    case SYMBOLS.YO: // かけ目（○）
      noFill();
      stroke(colors.accent);
      strokeWeight(2.5);
      ellipse(0, 0, cellSize * 0.5);
      break;

    case SYMBOLS.K2TOG: // 右上2目一度（/）
      stroke(colors.symbol);
      strokeWeight(2.5);
      line(
        -cellSize * 0.25,
        cellSize * 0.25,
        cellSize * 0.25,
        -cellSize * 0.25
      );
      break;

    case SYMBOLS.SSK: // 左上2目一度（\）
      stroke(colors.symbol);
      strokeWeight(2.5);
      line(
        -cellSize * 0.25,
        -cellSize * 0.25,
        cellSize * 0.25,
        cellSize * 0.25
      );
      break;

    case SYMBOLS.SLIP: // すべり目（V）
      noFill();
      stroke(colors.symbol);
      strokeWeight(2);
      beginShape();
      vertex(-cellSize * 0.2, -cellSize * 0.15);
      vertex(0, cellSize * 0.2);
      vertex(cellSize * 0.2, -cellSize * 0.15);
      endShape();
      break;

    case SYMBOLS.EMPTY: // 空白
      break;
  }

  pop();
}

// 凡例を描画
function drawLegend() {
  const legendX = 50;
  const legendY = 100 + rows * cellSize + 40;

  fill(colors.symbol);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("凡例:", legendX, legendY);

  textSize(12);
  const items = [
    { symbol: SYMBOLS.KNIT, name: "（空白） 表目" },
    { symbol: SYMBOLS.PURL, name: "・ 裏目" },
    { symbol: SYMBOLS.YO, name: "○ かけ目" },
    { symbol: SYMBOLS.K2TOG, name: "/ 右上2目一度" },
    { symbol: SYMBOLS.SSK, name: "\\ 左上2目一度" },
  ];

  for (let i = 0; i < items.length; i++) {
    const x = legendX + (i % 2) * 250;
    const y = legendY + 30 + Math.floor(i / 2) * 35;

    drawSymbol(x + 15, y - 5, items[i].symbol);
    fill(colors.symbol);
    text(items[i].name, x + 40, y);
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

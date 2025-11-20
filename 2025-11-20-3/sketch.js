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
  bg: "#FFFEF7", // 背景色（紙のような色）
  grid: "#E0E0E0", // グリッド線
  color1: "#ffffffff", // メインカラー（濃紺）
  color2: "#3498DB", // 青
  color3: "#F1C40F", // 黄色
};

function setup() {
  const c = createCanvas(900, 900);
  c.parent("canvas-container");

  // パターンを生成
  generatePattern();

  noLoop();
}

// 編み図パターンを生成（モザイク調の四角形）
function generatePattern() {
  pattern = [];

  // 背景を全てCOLOR1で初期化
  for (let r = 0; r < rows; r++) {
    pattern[r] = [];
    for (let c = 0; c < cols; c++) {
      pattern[r][c] = SYMBOLS.COLOR1;
    }
  }

  // モザイク調の四角形を10個ランダムに配置（枠のみ青または黄色）
  for (let i = 0; i < 10; i++) {
    // ランダムな位置とサイズ
    const startCol = floor(random(0, cols - 8));
    const startRow = floor(random(0, rows - 8));
    const mosaicWidth = floor(random(4, 9));
    const mosaicHeight = floor(random(4, 9));

    // この四角形の色をランダムに選択（青または黄色）
    const rectColor = random() > 0.5 ? SYMBOLS.COLOR2 : SYMBOLS.COLOR3;

    // 四角形の枠のみ描画
    for (let r = startRow; r < startRow + mosaicHeight; r++) {
      for (let c = startCol; c < startCol + mosaicWidth; c++) {
        if (r < rows && c < cols) {
          // 上下の辺または左右の辺のみ色を設定
          if (
            r === startRow ||
            r === startRow + mosaicHeight - 1 ||
            c === startCol ||
            c === startCol + mosaicWidth - 1
          ) {
            pattern[r][c] = rectColor;
          }
        }
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
  drawPattern();
  drawGrid();
  pop();

  // 凡例を描画
  drawLegend();
}

// タイトル描画
function drawTitle() {
  fill(colors.color1);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text("模様編みパターン図", width / 2, 40);

  textSize(14);
  fill(100);
  text("モザイク調のパターン", width / 2, 65);
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

  fill(colors.color1);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("凡例:", legendX, legendY);

  textSize(12);
  const items = [
    { symbol: SYMBOLS.COLOR1, name: "■ メインカラー（濃紺）" },
    { symbol: SYMBOLS.COLOR2, name: "□ コントラストカラー（白）" },
    { symbol: SYMBOLS.COLOR3, name: "■ アクセントカラー（赤）" },
  ];

  for (let i = 0; i < items.length; i++) {
    const x = legendX;
    const y = legendY + 30 + i * 35;

    drawSymbol(x + 15, y - 5, items[i].symbol);
    fill(colors.color1);
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

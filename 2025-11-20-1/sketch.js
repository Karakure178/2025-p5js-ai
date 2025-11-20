// 模様編みのパターン図
// 棒針編みの記号を使った編み図

let cellSize = 20; // 各マスのサイズ
let cols = 30; // 列数
let rows = 30; // 行数
let pattern = []; // パターンデータ

// 棒針編み記号の種類（二色編み込み）
const SYMBOLS = {
  COLOR1: 0, // 色1（メインカラー）
  COLOR2: 1, // 色2（コントラストカラー）
};

// 色設定
const colors = {
  bg: "#FFFEF7", // 背景色（紙のような色）
  grid: "#E0E0E0", // グリッド線
  color1: "#2C3E50", // メインカラー（濃紺）
  color2: "#FFFFFF", // コントラストカラー（白）
  accent: "#E74C3C", // アクセント色
};

function setup() {
  const c = createCanvas(900, 900);
  c.parent("canvas-container");

  // パターンを生成
  generatePattern();

  noLoop();
}

// 編み図パターンを生成（二色の編み込み模様）
function generatePattern() {
  pattern = [];

  // 二色の編み込みでノルディック柄を表現
  for (let r = 0; r < rows; r++) {
    pattern[r] = [];
    for (let c = 0; c < cols; c++) {
      const centerR = rows / 2;
      const centerC = cols / 2;

      // 中心からの距離
      const dx = c - centerC;
      const dy = r - centerR;

      // マンハッタン距離
      const manhattanDist = abs(dx) + abs(dy);

      // 二色で模様を作る
      if (manhattanDist < 3) {
        // 中心の小さなダイヤ
        pattern[r][c] = SYMBOLS.COLOR2;
      } else if (manhattanDist >= 5 && manhattanDist <= 7) {
        // 中間のリング（チェッカーパターン）
        if ((r + c) % 2 === 0) {
          pattern[r][c] = SYMBOLS.COLOR2;
        } else {
          pattern[r][c] = SYMBOLS.COLOR1;
        }
      } else if (manhattanDist >= 10 && manhattanDist <= 12) {
        // 外側のリング
        if ((r - c) % 2 === 0) {
          pattern[r][c] = SYMBOLS.COLOR2;
        } else {
          pattern[r][c] = SYMBOLS.COLOR1;
        }
      } else if (manhattanDist >= 15) {
        // 外枠（斜めストライプ）
        if ((r + c) % 3 === 0) {
          pattern[r][c] = SYMBOLS.COLOR2;
        } else {
          pattern[r][c] = SYMBOLS.COLOR1;
        }
      } else {
        // 背景
        pattern[r][c] = SYMBOLS.COLOR1;
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
  fill(colors.color1);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text("模様編みパターン図", width / 2, 40);

  textSize(14);
  fill(100);
  text("二色の編み込み模様（ノルディック柄）", width / 2, 65);
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
      fill(pattern[r][c] === SYMBOLS.COLOR1 ? colors.color1 : colors.color2);
      noStroke();
      square(x - cellSize / 2, y - cellSize / 2, cellSize);
      //circle(x, y, cellSize * 0.8);
      // drawSymbol(x, y, pattern[r][c]);
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
    { symbol: SYMBOLS.COLOR1, name: "■ メインカラー" },
    { symbol: SYMBOLS.COLOR2, name: "□ コントラストカラー" },
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

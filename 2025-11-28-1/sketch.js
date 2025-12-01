// 棒針編みの編み図
let cellSize = 30; // 各編み目のサイズ
let patternSize = 7; // パターンのサイズ（7x7）
let gridCols, gridRows; // グリッドの列数と行数
let offsetX, offsetY; // 中央配置のためのオフセット

// 編み記号を定義
const KNIT = 0; // 表編み（空白）
const PURL = 1; // 裏編み（横線）
const YO = 2; // かけ目（○）
const K2TOG = 3; // 右上2目一度（／）
const SSK = 4; // 左上2目一度（＼）

// 7x7のパターン配列（編み図のパターン）
let pattern = [
  [KNIT, KNIT, YO, SSK, K2TOG, YO, KNIT],
  [KNIT, YO, KNIT, SSK, K2TOG, KNIT, YO],
  [YO, KNIT, KNIT, SSK, K2TOG, KNIT, KNIT],
  [KNIT, KNIT, KNIT, PURL, KNIT, KNIT, KNIT],
  [K2TOG, KNIT, KNIT, YO, KNIT, KNIT, SSK],
  [K2TOG, KNIT, YO, KNIT, YO, KNIT, SSK],
  [K2TOG, YO, KNIT, KNIT, KNIT, YO, SSK],
];

function setup() {
  createCanvas(800, 800);

  // キャンバス全体に収まるグリッド数を計算
  gridCols = floor(width / cellSize);
  gridRows = floor(height / cellSize);

  // 中央配置のためのオフセットを計算
  offsetX = (width - gridCols * cellSize) / 2;
  offsetY = (height - gridRows * cellSize) / 2;

  noLoop();
}

function draw() {
  background(255);

  // グリッド線を描画
  stroke(200);
  strokeWeight(1);

  for (let i = 0; i <= gridCols; i++) {
    let x = offsetX + i * cellSize;
    line(x, offsetY, x, offsetY + gridRows * cellSize);
  }

  for (let j = 0; j <= gridRows; j++) {
    let y = offsetY + j * cellSize;
    line(offsetX, y, offsetX + gridCols * cellSize, y);
  }

  // 編み記号を描画（7x7パターンを繰り返し）
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      let x = offsetX + i * cellSize;
      let y = offsetY + j * cellSize;

      // パターン配列から対応する記号を取得（繰り返し）
      let patternX = i % patternSize;
      let patternY = j % patternSize;
      let symbol = pattern[patternY][patternX];

      // 記号を描画
      drawSymbol(symbol, x, y, cellSize);
    }
  }
}

// 編み記号を描画する関数
function drawSymbol(symbol, x, y, size) {
  let centerX = x + size / 2;
  let centerY = y + size / 2;
  let padding = size * 0.15;

  push();
  translate(centerX, centerY);

  switch (symbol) {
    case KNIT:
      // 表編み（空白 - 何も描画しない）
      break;

    case PURL:
      // 裏編み（横線）
      stroke(0);
      strokeWeight(2);
      line(-size / 2 + padding, 0, size / 2 - padding, 0);
      break;

    case YO:
      // かけ目（○）
      noFill();
      stroke(0);
      strokeWeight(2);
      circle(0, 0, size * 0.5);
      break;

    case K2TOG:
      // 右上2目一度（／）
      stroke(0);
      strokeWeight(2);
      line(
        -size / 2 + padding,
        size / 2 - padding,
        size / 2 - padding,
        -size / 2 + padding
      );
      break;

    case SSK:
      // 左上2目一度（＼）
      stroke(0);
      strokeWeight(2);
      line(
        -size / 2 + padding,
        -size / 2 + padding,
        size / 2 - padding,
        size / 2 - padding
      );
      break;
  }

  pop();
}

// キーボード入力でキャンバスを保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("knitting-chart", "png");
  }
}

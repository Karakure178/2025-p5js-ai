const GRID_SIZE = 7; // 7x7 マス
const CELL_SIZE = 20; // 1マスの大きさ
const TILE_COLS = 6; // タイルの列数（横にいくつ並べるか）
const TILE_ROWS = 4; // タイルの行数（縦にいくつ並べるか）

let pattern;

// ゆめかわパレット（パステル系）
const pastelColors = [
  [255, 204, 229], // pastel pink
  [221, 204, 255], // pastel purple
  [204, 236, 255], // pastel blue
  [204, 255, 236], // pastel mint
  [255, 246, 204], // pastel yellow
];

function setup() {
  const w = GRID_SIZE * CELL_SIZE * TILE_COLS;
  const h = GRID_SIZE * CELL_SIZE * TILE_ROWS;
  createCanvas(w, h);
  noLoop();
  pattern = generateCutePattern(GRID_SIZE);
}

function draw() {
  // やわらかい背景色
  background(252, 247, 255);

  // 繰り返しタイルを描画
  for (let ty = 0; ty < TILE_ROWS; ty++) {
    for (let tx = 0; tx < TILE_COLS; tx++) {
      drawPatternTile(
        tx * GRID_SIZE * CELL_SIZE,
        ty * GRID_SIZE * CELL_SIZE,
        pattern
      );
    }
  }

  // うっすら全体に白い格子線を重ねて編み図っぽさを出す
  drawGlobalGrid();
}

// 左右対称の「かわいい」ランダム 7x7 パターン生成
function generateCutePattern(size = 7) {
  const pat = Array.from({ length: size }, () => Array(size).fill(0));
  const half = Math.ceil(size / 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < half; x++) {
      // 1 の出現率を少し下げてドット絵っぽく
      const v = Math.random() < 0.4 ? 1 : 0;
      pat[y][x] = v;
      pat[y][size - 1 - x] = v; // 左右対称
    }
  }
  return pat;
}

// 1タイル分（7x7）を描く
function drawPatternTile(offsetX, offsetY, pat) {
  noStroke();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const sx = offsetX + x * CELL_SIZE;
      const sy = offsetY + y * CELL_SIZE;

      if (pat[y][x] === 1) {
        // 1 のところはゆめかわパステル色の丸
        const c = random(pastelColors);
        fill(c[0], c[1], c[2]);
        // 少し余白を残した丸にしてふわっと
        const r = CELL_SIZE * 0.8;
        ellipse(sx + CELL_SIZE / 2, sy + CELL_SIZE / 2, r, r);
      } else {
        // 0 のところはうっすら背景色寄り
        fill(255, 255, 255, 100);
        rect(sx, sy, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  // タイルごとに薄い枠線をつけて区切り感
  stroke(255, 240);
  strokeWeight(1);
  noFill();
  rect(offsetX, offsetY, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
}

// 画面全体に薄い格子線を引いて「編み図」感を強める
function drawGlobalGrid() {
  stroke(255, 230);
  strokeWeight(1);

  // 縦線
  for (let x = 0; x <= width; x += CELL_SIZE) {
    line(x, 0, x, height);
  }
  // 横線
  for (let y = 0; y <= height; y += CELL_SIZE) {
    line(0, y, width, y);
  }
}

// キーを押すたびに新しいゆめかわパターンを生成
function keyPressed() {
  pattern = generateCutePattern(GRID_SIZE);
  redraw();
}

// グリッド模様

let gridSize = 8; // グリッドの分割数
let cellSize; // 各セルのサイズ

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent("canvas-container");

  // セルサイズを計算
  cellSize = width / gridSize;
  rectMode(CENTER);

  noLoop(); // 静止画なので1回だけ描画
}

function draw() {
  background(240);

  // キャンバスの中心に移動
  translate(width / 2, height / 2);

  // グリッドを中心から描画
  let halfGrid = gridSize / 2;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = (i - halfGrid) * cellSize;
      let y = (j - halfGrid) * cellSize;

      // セルの位置に基づいて模様を描画
      drawPattern(x, y, cellSize, i, j);
    }
  }
}

// 各セルに模様を描画する関数
function drawPattern(x, y, size, i, j) {
  push();
  translate(x + size / 2, y + size / 2);

  // 市松模様の色分け
  if ((i + j) % 2 === 0) {
    fill(100, 150, 200);
  } else {
    fill(200, 100, 150);
  }

  noStroke();
  rect(0, 0, size, size);

  // 中心に円を描画
  fill(255);
  let circleSize = size * 0.4;
  //   ellipse(0, 0, circleSize, circleSize);
  square(0, 0, circleSize);

  // 四隅に小さな円を描画
  fill(50);
  let cornerSize = size * 0.15;
  let offset = size * 0.3;

  square(-offset, -offset, cornerSize);
  square(offset, -offset, cornerSize);
  square(-offset, offset, cornerSize);
  square(offset, offset, cornerSize);
  //   ellipse(-offset, -offset, cornerSize, cornerSize);
  //   ellipse(offset, -offset, cornerSize, cornerSize);
  //   ellipse(-offset, offset, cornerSize, cornerSize);
  //   ellipse(offset, offset, cornerSize, cornerSize);

  pop();
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("grid-pattern", "png");
  }
}

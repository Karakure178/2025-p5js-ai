function setup() {
  createCanvas(800, 800);
  noLoop(); // 静止画なのでループは不要
  background(255);
  strokeWeight(2);
  stroke(0);
  rect(0, 0, width, height);

  // グリッドを描画する関数を呼び出し
  drawGrid(0, 0, width, height, 5);
}

function drawGrid(x, y, w, h, depth) {
  if (depth <= 0) {
    return; // 再帰の終了条件
  }

  // グリッドをランダムに分割するか決定
  let splitHorizontally = random() > 0.5;
  let splitVertically = random() > 0.5;

  if (splitHorizontally && w > 50) {
    let splitX = x + w * random(0.2, 0.8);
    drawGrid(x, y, splitX - x, h, depth - 1);
    drawGrid(splitX, y, w - (splitX - x), h, depth - 1);
  } else if (splitVertically && h > 50) {
    let splitY = y + h * random(0.2, 0.8);
    drawGrid(x, y, w, splitY - y, depth - 1);
    drawGrid(x, y + splitY - y, w, h - (splitY - y), depth - 1);
  } else {
    // 分割しない場合は、セル内に図形を描画
    drawShapeInCell(x, y, w, h);
  }
}

function drawShapeInCell(x, y, w, h) {
  // セルの中央に円弧を描画
  push();
  translate(x + w / 2, y + h / 2);
  noFill();
  stroke(0);
  strokeWeight(random(1, 4));

  let startAngle = random(TWO_PI);
  let endAngle = startAngle + random(PI / 4, PI);
  let radius = min(w, h) * random(0.6, 0.9);

  arc(0, 0, radius, radius, startAngle, endAngle);
  pop();
}

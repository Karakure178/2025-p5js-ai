// p5.brushでかわいいハートを描画

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  colorMode(HSB, 360, 100, 100, 100);

  // p5.brushを初期化
  brush.load();

  noLoop();
}

function draw() {
  background(350, 15, 100);

  // かわいいハートを描画
  drawCuteHeart(0, 0, 300);
}

// かわいいハートを描画する関数
function drawCuteHeart(centerX, centerY, size) {
  push();
  translate(centerX, centerY);

  // ハートの形状を計算
  let points = [];
  for (let angle = 0; angle < TWO_PI; angle += 0.05) {
    let x = (size * 16 * pow(sin(angle), 3)) / 16;
    let y =
      (-size *
        (13 * cos(angle) -
          5 * cos(2 * angle) -
          2 * cos(3 * angle) -
          cos(4 * angle))) /
      16;
    points.push({ x: x, y: y });
  }

  // ハートを塗りつぶし（通常のfillで）
  fill(340, 80, 95, 50);
  noStroke();
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  // ハートの輪郭をmarkerブラシで描画
  brush.set("marker", color(340, 90, 70), 1);
  brush.strokeWeight(8);
  for (let i = 0; i < points.length; i++) {
    let p1 = points[i];
    let p2 = points[(i + 1) % points.length];
    brush.line(p1.x, p1.y, p2.x, p2.y);
  }

  // かわいい装飾を追加
  drawDecorations(size);

  pop();
}

// かわいい装飾を描画
function drawDecorations(size) {
  // 小さなハートを周りに散らす
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let distance = size * 0.7;
    let x = cos(angle) * distance;
    let y = sin(angle) * distance;

    drawSmallHeart(x, y, size * 0.15, (angle * 180) / PI + 90);
  }

  // キラキラを描画
  for (let i = 0; i < 12; i++) {
    let angle = random(TWO_PI);
    let distance = random(size * 0.5, size * 0.9);
    let x = cos(angle) * distance;
    let y = sin(angle) * distance;

    drawSparkle(x, y, random(5, 15));
  }
}

// 小さなハートを描画
function drawSmallHeart(x, y, size, rotation) {
  push();
  translate(x, y);
  rotate(radians(rotation));

  // sprayブラシで小さな丸を描画
  brush.set("spray", color(340, 70, 90), 1);
  brush.strokeWeight(size);
  brush.circle(0, 0, size);

  pop();
}

// キラキラを描画
function drawSparkle(x, y, size) {
  push();
  translate(x, y);

  brush.set("pen", color(50, 80, 100), 1);
  brush.strokeWeight(2);

  // 十字のキラキラ
  brush.line(-size, 0, size, 0);
  brush.line(0, -size, 0, size);

  pop();
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("cute-heart", "png");
  }
  if (key === "r") {
    redraw();
  }
}

// p5.brushでグリッド状にかわいいハートを描画

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
  translate(-width / 2, -height / 2);

  // グリッド数
  const gridNum = 3;

  // グリッドでハートを配置
  drawHeartGrid(gridNum);
}

// グリッド状にハートを配置する関数
function drawHeartGrid(num) {
  const n1 = num + 1;

  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;

  const nw = width / n1;
  const nh = height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);

      // 各グリッドセルの中心にハートを描画
      const heartSize = nw * 0.7; // グリッドサイズの70%
      // ランダムな色相を生成
      const hue = random(360);
      drawCuteHeart(x + nw / 2, y + nh / 2, heartSize, hue);
    }
  }
}

// かわいいハートを描画する関数
function drawCuteHeart(centerX, centerY, size, hue) {
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

  // ハートを塗りつぶし（カラフルに）
  fill(hue, 80, 95, 50);
  noStroke();
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);

  // ハートの輪郭をmarkerブラシで描画（カラフルに）
  brush.set("marker", color(hue, 90, 70), 1);
  brush.strokeWeight(max(2, size / 50)); // サイズに応じて線の太さを調整
  for (let i = 0; i < points.length; i++) {
    let p1 = points[i];
    let p2 = points[(i + 1) % points.length];
    brush.line(p1.x, p1.y, p2.x, p2.y);
  }

  pop();
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("heart-grid", "png");
  }
  if (key === "r") {
    redraw();
  }
}

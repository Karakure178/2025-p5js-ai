// 大人かわいい静止画 - ソフトミニマル
function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);

  // 一度だけ描画
  noLoop();
}

function draw() {
  // 温かみのあるクリーム色の背景
  background(45, 15, 95);

  // メインの構成要素
  drawSoftShapes();

  // かわいい小さな要素
  drawCuteElements();

  // 植物的要素
  drawBotanicalElements();

  // ソフトなテクスチャ
  addSoftTexture();

  // 優しいアクセント
  drawGentleAccents();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function drawSoftShapes() {
  push();

  // メインの大きな円形 - 温かいピンクベージュ
  fill(15, 25, 88, 80);
  noStroke();
  let mainSize = 280;
  ellipse(width * 0.35, height * 0.4, mainSize, mainSize);

  // 重なる円形 - ソフトなラベンダー
  fill(280, 30, 85, 70);
  ellipse(width * 0.55, height * 0.35, 200, 200);

  // 小さなアクセント円 - 優しいピーチ
  fill(25, 35, 90, 85);
  ellipse(width * 0.7, height * 0.6, 120, 120);

  // 背景の大きなソフト図形
  fill(200, 20, 90, 40);
  ellipse(width * 0.15, height * 0.75, 180, 180);

  pop();
}

function drawCuteElements() {
  push();

  // かわいい小さな円のグループ
  let colors = [
    [340, 40, 85], // ソフトピンク
    [60, 35, 88], // クリーム
    [180, 25, 82], // ミントグリーン
    [270, 30, 80], // ライトパープル
  ];

  // 散りばめられた小さな円
  for (let i = 0; i < 15; i++) {
    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.1, height * 0.9);
    let size = random(8, 25);
    let colorIndex = floor(random(colors.length));

    fill(
      colors[colorIndex][0],
      colors[colorIndex][1],
      colors[colorIndex][2],
      60
    );
    noStroke();
    ellipse(x, y, size, size);

    // 小さなハイライト
    fill(colors[colorIndex][0], colors[colorIndex][1] * 0.3, 95, 40);
    ellipse(x - size * 0.2, y - size * 0.2, size * 0.4, size * 0.4);
  }

  // かわいいハート形
  drawHeart(width * 0.8, height * 0.25, 20, color(350, 45, 85, 70));
  drawHeart(width * 0.15, height * 0.2, 15, color(330, 35, 88, 60));

  // 小さな星形
  drawStar(width * 0.25, height * 0.15, 12, color(50, 40, 90, 65));
  drawStar(width * 0.85, height * 0.8, 8, color(280, 35, 85, 70));

  pop();
}

function drawBotanicalElements() {
  push();

  // 優しい葉っぱ
  drawLeaf(width * 0.1, height * 0.4, 30, color(120, 35, 75, 60));
  drawLeaf(width * 0.9, height * 0.65, 25, color(140, 30, 80, 55));
  drawLeaf(width * 0.4, height * 0.85, 20, color(100, 40, 70, 65));

  // 小さな花
  drawFlower(width * 0.75, height * 0.15, 18, color(320, 40, 88, 75));
  drawFlower(width * 0.2, height * 0.6, 15, color(280, 35, 85, 70));

  // 繊細な茎や枝
  stroke(80, 30, 70, 40);
  strokeWeight(2);

  // 曲線的な茎
  noFill();
  beginShape();
  vertex(width * 0.1, height * 0.45);
  bezierVertex(
    width * 0.15,
    height * 0.5,
    width * 0.18,
    height * 0.55,
    width * 0.2,
    height * 0.6
  );
  endShape();

  beginShape();
  vertex(width * 0.85, height * 0.7);
  bezierVertex(
    width * 0.88,
    height * 0.75,
    width * 0.9,
    height * 0.8,
    width * 0.92,
    height * 0.85
  );
  endShape();

  pop();
}

function drawHeart(x, y, size, heartColor) {
  push();
  translate(x, y);
  fill(heartColor);
  noStroke();

  beginShape();
  vertex(0, size * 0.3);
  bezierVertex(-size * 0.7, -size * 0.2, -size * 0.7, size * 0.3, 0, size);
  bezierVertex(size * 0.7, size * 0.3, size * 0.7, -size * 0.2, 0, size * 0.3);
  endShape(CLOSE);

  pop();
}

function drawStar(x, y, size, starColor) {
  push();
  translate(x, y);
  fill(starColor);
  noStroke();

  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size * 0.5;
    let px = cos(angle) * radius;
    let py = sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);

  pop();
}

function drawLeaf(x, y, size, leafColor) {
  push();
  translate(x, y);
  rotate(random(-PI / 4, PI / 4));
  fill(leafColor);
  noStroke();

  beginShape();
  vertex(0, -size);
  bezierVertex(size * 0.6, -size * 0.7, size * 0.6, size * 0.7, 0, size);
  bezierVertex(-size * 0.6, size * 0.7, -size * 0.6, -size * 0.7, 0, -size);
  endShape(CLOSE);

  // 葉脈
  stroke(
    hue(leafColor),
    saturation(leafColor) + 10,
    brightness(leafColor) - 15,
    30
  );
  strokeWeight(1);
  line(0, -size * 0.8, 0, size * 0.8);

  pop();
}

function drawFlower(x, y, size, flowerColor) {
  push();
  translate(x, y);

  // 花びら
  for (let i = 0; i < 5; i++) {
    push();
    rotate((TWO_PI / 5) * i);
    fill(flowerColor);
    noStroke();
    ellipse(0, -size * 0.4, size * 0.6, size * 0.8);
    pop();
  }

  // 花の中心
  fill(50, 60, 95, 80);
  noStroke();
  ellipse(0, 0, size * 0.4, size * 0.4);

  pop();
}

function drawGentleAccents() {
  push();

  // 優しい曲線
  noFill();
  strokeWeight(3);
  stroke(200, 25, 85, 50);

  beginShape();
  vertex(width * 0.05, height * 0.3);
  bezierVertex(
    width * 0.2,
    height * 0.25,
    width * 0.3,
    height * 0.35,
    width * 0.45,
    height * 0.3
  );
  endShape();

  strokeWeight(2);
  stroke(320, 30, 88, 45);
  beginShape();
  vertex(width * 0.6, height * 0.75);
  bezierVertex(
    width * 0.7,
    height * 0.7,
    width * 0.8,
    height * 0.8,
    width * 0.95,
    height * 0.75
  );
  endShape();

  // 小さな装飾点
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(2, 6);

    fill(random(300, 360), random(20, 40), random(85, 95), random(30, 60));
    noStroke();
    ellipse(x, y, size, size);
  }

  pop();
}

function addSoftTexture() {
  push();

  // ソフトなノイズテクスチャ
  for (let i = 0; i < 800; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    let alpha = random(5, 15);

    // 温かい色調のノイズ
    if (random() > 0.6) {
      fill(30, 20, 100, alpha); // 温かい白
    } else if (random() > 0.3) {
      fill(350, 15, 90, alpha); // ソフトピンク
    } else {
      fill(200, 10, 95, alpha); // ミントホワイト
    }

    noStroke();
    ellipse(x, y, size, size);
  }

  // 柔らかい光の効果
  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(30, 80);

    fill(40, 10, 98, 8);
    noStroke();
    ellipse(x, y, size, size);
  }

  pop();
}

// マウスクリックで新しいパターン
function mousePressed() {
  redraw();
}

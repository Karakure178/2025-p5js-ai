// シックでシンプルな静止画 - モダンミニマル
function setup() {
  createCanvas(800, 800);
  colorMode(RGB, 255);

  // 一度だけ描画
  noLoop();
}

function draw() {
  // 深いチャコールグレーの背景
  background(28, 28, 32);

  // メインの構成要素
  drawMinimalComposition();

  // アクセントライン
  drawAccentLines();

  // 幾何学的要素
  drawGeometricElements();

  // テクスチャの追加
  addSubtleTexture();
}

function drawMinimalComposition() {
  push();

  // 黄金比を使った配置
  let goldenRatio = 1.618;
  let centerX = width / 2;
  let centerY = height / 2;

  // メインの長方形 - オフホワイト
  fill(245, 245, 240);
  noStroke();
  let mainWidth = width * 0.4;
  let mainHeight = mainWidth / goldenRatio;
  rect(
    centerX - mainWidth / 2,
    centerY - mainHeight / 2 - 60,
    mainWidth,
    mainHeight
  );

  // サブ要素 - ダークグレー
  fill(65, 65, 70);
  let subWidth = width * 0.15;
  let subHeight = subWidth * goldenRatio;
  rect(centerX + mainWidth / 3, centerY + 40, subWidth, subHeight);

  // アクセント - 深いネイビー
  fill(25, 35, 50);
  let accentSize = 40;
  rect(
    centerX - mainWidth / 2 + 20,
    centerY - mainHeight / 2 - 40,
    accentSize,
    accentSize
  );

  pop();
}

function drawAccentLines() {
  push();

  // シックなラインワーク
  strokeWeight(2);
  stroke(180, 180, 175);

  // 水平線
  line(width * 0.2, height * 0.3, width * 0.8, height * 0.3);

  // 垂直線
  line(width * 0.25, height * 0.25, width * 0.25, height * 0.75);

  // 細いアクセントライン
  strokeWeight(1);
  stroke(140, 140, 135);
  line(width * 0.6, height * 0.2, width * 0.9, height * 0.2);
  line(width * 0.1, height * 0.8, width * 0.4, height * 0.8);

  pop();
}

function drawGeometricElements() {
  push();

  // 円形要素 - エレガントなベージュ
  fill(220, 215, 205);
  noStroke();
  let circleSize = 80;
  ellipse(width * 0.75, height * 0.65, circleSize, circleSize);

  // 小さな円 - アクセント
  fill(45, 55, 65);
  ellipse(width * 0.3, height * 0.7, 25, 25);

  // 三角形 - シャープなアクセント
  fill(200, 195, 185);
  noStroke();
  triangle(
    width * 0.15,
    height * 0.45,
    width * 0.15 - 30,
    height * 0.45 + 40,
    width * 0.15 + 30,
    height * 0.45 + 40
  );

  pop();
}

function addSubtleTexture() {
  push();

  // 非常に繊細なノイズテクスチャ
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);

    // ランダムな明暗のドット
    if (random() > 0.5) {
      fill(255, 255, 255, 8); // 白い微細な点
    } else {
      fill(0, 0, 0, 8); // 黒い微細な点
    }
    noStroke();
    ellipse(x, y, 1, 1);
  }

  // 紙のような質感
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(10, 30);
    let h = random(1, 3);

    fill(255, 255, 255, 3);
    noStroke();
    rect(x, y, w, h);
  }

  pop();
}

// マウスクリックで微細な変更
function mousePressed() {
  redraw();
}

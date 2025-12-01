const CANVAS_W = 800;
const CANVAS_H = 600;
const SNOW_COUNT = 160;

let scribble;
let snowflakes = [];

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  noLoop();
  scribble = new Scribble(this);

  // ふんわり舞う雪の初期座標
  for (let i = 0; i < SNOW_COUNT; i++) {
    snowflakes.push({
      x: random(width),
      y: random(height),
      size: random(2, 5),
      alpha: random(160, 255),
    });
  }
}

function draw() {
  drawSky();
  drawMoon();
  drawHillLayer();
  drawTrees();
  drawGarlands();
  drawSnow();
  drawGreeting();
}

// 夜空を手書きっぽくグラデーションで塗る
function drawSky() {
  for (let y = 0; y < height; y++) {
    const t = map(y, 0, height, 0, 1);
    const col = lerpColor(color(8, 12, 26), color(20, 45, 88), pow(t, 1.3));
    stroke(col);
    line(0, y, width, y);
  }
}

// 月と光のにじみ
function drawMoon() {
  const cx = width * 0.74;
  const cy = height * 0.2;
  noStroke();
  for (let r = 120; r > 20; r -= 12) {
    const alpha = map(r, 120, 20, 40, 180);
    fill(255, 240, 200, alpha);
    ellipse(cx, cy, r * 1.1, r);
  }
  noFill();
  stroke(255, 245, 210);
  scribble.scribbleEllipse(cx, cy, 90, 82);
}

// 雪原をざっくり描く
function drawHillLayer() {
  noStroke();
  fill(32, 46, 70);
  beginShape();
  vertex(0, height);
  vertex(0, height * 0.72);
  bezierVertex(
    width * 0.2,
    height * 0.6,
    width * 0.55,
    height * 0.85,
    width,
    height * 0.7
  );
  vertex(width, height);
  endShape(CLOSE);

  fill(24, 34, 58);
  beginShape();
  vertex(0, height);
  vertex(0, height * 0.82);
  bezierVertex(
    width * 0.25,
    height * 0.78,
    width * 0.55,
    height * 0.92,
    width,
    height * 0.86
  );
  vertex(width, height);
  endShape(CLOSE);

  stroke(210, 230, 255, 160);
  strokeWeight(1.5);
  scribble.scribbleLine(40, height * 0.78, width - 40, height * 0.72);
}

// クリスマスツリーを複数配置
function drawTrees() {
  const baseY = height * 0.78;
  const positions = [
    { x: width * 0.2, scale: 0.8 },
    { x: width * 0.35, scale: 0.9 },
    { x: width * 0.5, scale: 1.1 },
    { x: width * 0.66, scale: 0.85 },
    { x: width * 0.8, scale: 0.75 },
  ];

  for (const pos of positions) {
    drawTree(pos.x, baseY, pos.scale);
  }
}

// 単体のツリーと幹
function drawTree(centerX, baseY, scale) {
  const heightTree = 100 * scale;
  const widthTree = 110 * scale;
  const layers = 7;

  for (let i = 0; i < layers; i++) {
    const t = i / (layers - 1);
    const layerWidth = lerp(widthTree, widthTree * 0.2, t);
    const layerHeight = heightTree / layers;
    const yBottom = baseY - i * 19;
    const yTop = yBottom / 1.1 - layerHeight;

    fill(20 + i * 18, 100 + i * 20, 70 + i * 15);
    noStroke();
    triangle(
      centerX - layerWidth / 2,
      yBottom,
      centerX + layerWidth / 2,
      yBottom,
      centerX,
      yTop
    );

    noFill();
    stroke(190, 235, 210, 200);
    scribble.scribbleLine(centerX - layerWidth / 2, yBottom, centerX, yTop);
    scribble.scribbleLine(centerX + layerWidth / 2, yBottom, centerX, yTop);
    scribble.scribbleLine(
      centerX - layerWidth / 2,
      yBottom,
      centerX + layerWidth / 2,
      yBottom
    );
  }

  // 幹
  const trunkW = 18 * scale;
  const trunkH = 30 * scale;
  noStroke();
  fill(90, 60, 40);
  rect(centerX - trunkW / 2, baseY, trunkW, trunkH);
  noFill();
  stroke(220, 190, 150);
  scribble.scribbleRect(centerX, baseY + trunkH / 2, trunkW, trunkH);

  // 星
  drawStar(centerX, baseY - heightTree - 12, 18 * scale);
}

// ツリー上部の星をスケッチ
function drawStar(cx, cy, size) {
  stroke(255, 240, 200);
  strokeWeight(1.3);
  for (let i = 0; i < 4; i++) {
    const angle = (PI / 4) * i;
    const x1 = cx + cos(angle) * size;
    const y1 = cy + sin(angle) * size;
    scribble.scribbleLine(cx, cy, x1, y1);
  }
  noStroke();
  fill(255, 240, 180);
  ellipse(cx, cy, size * 0.6, size * 0.6);
}

// 電飾をランダムに散りばめる
function drawGarlands() {
  const colors = [
    color(255, 210, 140),
    color(255, 120, 140),
    color(140, 200, 255),
  ];
  strokeWeight(1.2);
  for (let i = 0; i < 5; i++) {
    const y = height * 0.3 + i * 25;
    stroke(255, 230, 210, 180);
    scribble.scribbleLine(width * 0.15, y, width * 0.85, y + sin(i) * 20);

    for (let j = 0; j < 8; j++) {
      const t = j / 7;
      const px = lerp(width * 0.15, width * 0.85, t);
      const py = y + sin(t * PI) * 18;
      const c = random(colors);
      noStroke();
      fill(c);
      ellipse(px, py, 14, 14);
      noFill();
      stroke(c);
      scribble.scribbleEllipse(px, py, 16, 16);
    }
  }
}

// はらはら舞う雪
function drawSnow() {
  noStroke();
  for (const flake of snowflakes) {
    fill(255, flake.alpha);
    ellipse(flake.x, flake.y, flake.size, flake.size);
  }
}

// メッセージ帯
function drawGreeting() {
  noStroke();
  fill(10, 15, 28, 180);
  rect(width * 0.2, height - 70, width * 0.6, 50, 8);

  fill(255);
  textAlign(CENTER);
  textSize(28);
  text("手書きなクリスマス", width / 2, height - 38);

  stroke(255, 230, 210);
  scribble.scribbleLine(width * 0.3, height - 28, width * 0.7, height - 28);
}

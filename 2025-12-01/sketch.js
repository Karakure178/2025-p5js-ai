const CANVAS_W = 800;
const CANVAS_H = 600;
const SNOW_COUNT = 220;

let snowPositions = [];

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  noLoop();

  // 雪の座標をランダムで用意
  for (let i = 0; i < SNOW_COUNT; i++) {
    snowPositions.push({
      x: random(width),
      y: random(height),
      size: random(2, 5),
      alpha: random(150, 255),
    });
  }
}

function draw() {
  drawSkyGradient();
  drawAuroraBands();
  drawSnow();
}

// 夜空を滑らかなグラデーションで塗る
function drawSkyGradient() {
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(color(8, 10, 30), color(18, 35, 70), pow(t, 1.2));
    stroke(c);
    line(0, y, width, y);
  }
}

// 中央に光のハローを重ねて抽象的な光源を演出
function drawHalo() {
  noStroke();
  for (let r = 300; r > 20; r -= 6) {
    let t = map(r, 300, 20, 0, 1);
    fill(
      lerpColor(color(80, 120, 190, 10), color(255, 240, 200, 160), pow(t, 2.0))
    );
    ellipse(width / 2, height * 0.45, r * 1.4, r);
  }
}

// 曲線を重ねてオーロラ状の抽象レイヤーを作成
function drawAuroraBands() {
  noStroke();
  for (let i = 0; i < 4; i++) {
    fill(20, 80 + i * 30, 120 + i * 20, 80);
    beginShape();
    const baseY = height * 0.35 + i * 35;
    for (let x = -50; x <= width + 50; x += 30) {
      let y = baseY + sin(x * 0.01 + i) * 25;
      curveVertex(x, y);
    }
    curveVertex(width + 60, height);
    curveVertex(-60, height);
    endShape(CLOSE);
  }
}

// 雪の粒
function drawSnow() {
  noStroke();
  for (const snow of snowPositions) {
    fill(255, snow.alpha);
    ellipse(snow.x, snow.y, snow.size, snow.size);
  }
}

// オーナメントを抽象的なリング列で表現
function drawOrbGarlands() {
  noFill();
  strokeWeight(2);
  const hues = [
    color(255, 120, 120, 200),
    color(255, 220, 160, 180),
    color(140, 200, 255, 180),
  ];
  for (let i = 0; i < 11; i++) {
    const angle = map(i, 0, 10, -PI / 3, PI / 3);
    const radius = 230;
    const cx = width / 2 + cos(angle) * radius * 0.4;
    const cy = height * 0.65 + sin(angle) * radius * 0.2;
    stroke(random(hues));
    ellipse(cx, cy, 40 + sin(angle * 3) * 15, 40 + cos(angle * 2) * 15);
  }
}

// 抽象ロゴ風メッセージ
function drawMessage() {
  textAlign(CENTER);
  textFont("Helvetica");
  textSize(30);
  fill(255, 230);
  text("ABSTRACT XMAS", width / 2, height - 40);
}

// シンプルな星を描画
function drawStar(cx, cy, size) {
  push();
  translate(cx, cy);
  beginShape();
  for (let i = 0; i < 10; i++) {
    const angle = (i * PI) / 5;
    const radius = i % 2 === 0 ? size : size / 2.5;
    vertex(cos(angle) * radius, sin(angle) * radius);
  }
  endShape(CLOSE);
  pop();
}

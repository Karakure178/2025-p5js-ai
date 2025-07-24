// 回転する花びらのようなパターンアニメーション
let angle = 0;
let radius = 100;
let numPetals = 8;
let colorOffset = 0;
let particles = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);

  // パーティクルを初期化
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // 背景をゆっくりとフェード
  background(220, 30, 10, 20);

  translate(width / 2, height / 2);

  // メインの花びらパターン
  drawFlowerPattern();

  // 回転する輪
  drawRotatingRings();

  // 浮遊するパーティクル
  updateParticles();

  // アニメーション変数を更新
  angle += 0.02;
  colorOffset += 0.5;
  radius = 100 + sin(angle * 2) * 30;
}

function drawFlowerPattern() {
  push();

  for (let i = 0; i < numPetals; i++) {
    push();
    rotate((TWO_PI / numPetals) * i + angle);

    // 花びらの色を時間で変化
    let hue = (i * 45 + colorOffset) % 360;
    fill(hue, 80, 90, 70);
    noStroke();

    // 花びらの形を描画
    beginShape();
    for (let j = 0; j <= 20; j++) {
      let t = map(j, 0, 20, 0, PI);
      let r = radius * sin(t) * (1 + 0.3 * sin(angle * 3 + i));
      let x = r * cos(t);
      let y = r * sin(t);
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  pop();
}

function drawRotatingRings() {
  push();

  // 外側の輪
  for (let ring = 0; ring < 3; ring++) {
    let ringRadius = 150 + ring * 50;
    let numDots = 12 + ring * 4;

    for (let i = 0; i < numDots; i++) {
      let dotAngle = (TWO_PI / numDots) * i + angle * (1 + ring * 0.5);
      let x = cos(dotAngle) * ringRadius;
      let y = sin(dotAngle) * ringRadius;

      let hue = (i * 30 + colorOffset + ring * 60) % 360;
      fill(hue, 70, 80, 60);
      noStroke();

      let dotSize = 8 + sin(angle * 4 + i) * 3;
      ellipse(x, y, dotSize, dotSize);
    }
  }

  pop();
}

function updateParticles() {
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.size = random(2, 6);
    this.hue = random(360);
    this.life = 255;
    this.maxLife = 255;
  }

  update() {
    // 中心に向かって緩やかに引力
    let centerForce = 0.001;
    this.vx += -this.x * centerForce;
    this.vy += -this.y * centerForce;

    // ランダムな動き
    this.vx += random(-0.1, 0.1);
    this.vy += random(-0.1, 0.1);

    // 速度制限
    this.vx = constrain(this.vx, -2, 2);
    this.vy = constrain(this.vy, -2, 2);

    this.x += this.vx;
    this.y += this.vy;

    this.life -= 1;

    // パーティクルをリセット
    if (
      this.life <= 0 ||
      abs(this.x) > width / 2 + 50 ||
      abs(this.y) > height / 2 + 50
    ) {
      this.reset();
    }
  }

  display() {
    push();
    translate(this.x, this.y);

    let alpha = map(this.life, 0, this.maxLife, 0, 50);
    fill(this.hue, 60, 90, alpha);
    noStroke();

    ellipse(0, 0, this.size, this.size);

    // 小さな光の効果
    fill(this.hue, 30, 100, alpha * 0.3);
    ellipse(0, 0, this.size * 2, this.size * 2);

    pop();
  }
}

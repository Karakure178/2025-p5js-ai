// ゆらゆらした海藻のようなアニメーション
let time = 0;
let waves = [];
let floatingShapes = [];
let noiseScale = 0.01;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);

  // 波を初期化
  for (let i = 0; i < 8; i++) {
    waves.push(new Wave());
  }

  // 浮遊する形を初期化
  for (let i = 0; i < 15; i++) {
    floatingShapes.push(new FloatingShape());
  }
}

function draw() {
  // 背景のグラデーション
  drawBackground();

  // 波を描画
  for (let wave of waves) {
    wave.update();
    wave.display();
  }

  // 浮遊する形を描画
  for (let shape of floatingShapes) {
    shape.update();
    shape.display();
  }

  // ゆらゆらするパーティクル
  drawSwayingParticles();

  time += 0.01;
}

function drawBackground() {
  // グラデーション背景
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let hue = 200 + sin(time * 0.5 + y * 0.01) * 30;
    let sat = 60 + t * 20;
    let bright = 15 + t * 25;
    stroke(hue, sat, bright);
    line(0, y, width, y);
  }
}

class Wave {
  constructor() {
    this.yOffset = random(height);
    this.amplitude = random(30, 80);
    this.frequency = random(0.005, 0.02);
    this.speed = random(0.3, 0.8);
    this.hue = random(180, 240);
    this.thickness = random(2, 8);
  }

  update() {
    // 波の特性もゆらゆら変化
    this.amplitude += sin(time * 2 + this.yOffset * 0.01) * 0.5;
    this.frequency += cos(time * 1.5 + this.yOffset * 0.005) * 0.0001;
  }

  display() {
    push();
    noFill();
    strokeWeight(this.thickness);

    // 複数の線で波を描画してゆらゆら感を演出
    for (let layer = 0; layer < 3; layer++) {
      let alpha = 30 - layer * 10;
      stroke(this.hue, 70, 80, alpha);

      beginShape();
      noFill();

      for (let x = -50; x <= width + 50; x += 5) {
        let y =
          this.yOffset +
          sin(x * this.frequency + time * this.speed) * this.amplitude +
          sin(x * this.frequency * 2 + time * this.speed * 1.5) *
            this.amplitude *
            0.3 +
          noise(x * noiseScale, time * 0.5) * 20;

        // レイヤーごとにオフセット
        y += layer * 2;

        curveVertex(x, y);
      }
      endShape();
    }

    pop();
  }
}

class FloatingShape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(20, 60);
    this.hue = random(280, 320);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.rotationSpeed = random(-0.02, 0.02);
    this.rotation = 0;
  }

  update() {
    // ノイズを使った自然なゆらゆら動き
    this.x += (noise(this.noiseOffsetX + time * 0.5) - 0.5) * 2;
    this.y += (noise(this.noiseOffsetY + time * 0.5) - 0.5) * 1.5;

    // 画面端で反対側に出現
    if (this.x < -this.size) this.x = width + this.size;
    if (this.x > width + this.size) this.x = -this.size;
    if (this.y < -this.size) this.y = height + this.size;
    if (this.y > height + this.size) this.y = -this.size;

    this.rotation += this.rotationSpeed;

    // サイズもゆらゆら変化
    this.size += sin(time * 3 + this.noiseOffsetX) * 0.5;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    let alpha = 40 + sin(time * 2 + this.noiseOffsetX) * 20;
    fill(this.hue, 70, 90, alpha);
    noStroke();

    // ゆらゆらした楕円形
    beginShape();
    for (let i = 0; i <= 12; i++) {
      let angle = map(i, 0, 12, 0, TWO_PI);
      let r = this.size * (0.8 + 0.2 * sin(angle * 3 + time * 4));
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      curveVertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

function drawSwayingParticles() {
  // 背景に散らばるゆらゆらパーティクル
  for (let i = 0; i < 100; i++) {
    let x = (i * 13) % width;
    let y = (i * 17) % height;

    // ノイズベースの動き
    let offsetX = noise(x * 0.01, y * 0.01, time * 0.5) * 30 - 15;
    let offsetY = noise(x * 0.01 + 100, y * 0.01 + 100, time * 0.3) * 20 - 10;

    let finalX = x + offsetX;
    let finalY = y + offsetY;

    let hue = 60 + sin(time + i * 0.1) * 30;
    let size = 2 + sin(time * 2 + i * 0.2) * 1.5;
    let alpha = 30 + sin(time * 1.5 + i * 0.15) * 20;

    fill(hue, 60, 90, alpha);
    noStroke();
    ellipse(finalX, finalY, size, size);

    // 光の効果
    fill(hue, 30, 100, alpha * 0.3);
    ellipse(finalX, finalY, size * 3, size * 3);
  }
}

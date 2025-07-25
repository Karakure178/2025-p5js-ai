// 魔法の万華鏡アニメーション - 多層レイヤーの複雑な動き
let time = 0;
let morphingShapes = [];
let energyOrbs = [];
let fractalLines = [];
let colorPalette = [];
let glitchEffect = false;
let glitchTimer = 0;

function setup() {
  createCanvas(900, 900);
  colorMode(HSB, 360, 100, 100, 100);

  // カラーパレットを初期化
  initColorPalette();

  // モーフィング図形を初期化
  for (let i = 0; i < 12; i++) {
    morphingShapes.push(new MorphingShape());
  }

  // エネルギーオーブを初期化
  for (let i = 0; i < 8; i++) {
    energyOrbs.push(new EnergyOrb());
  }

  // フラクタルラインを初期化
  for (let i = 0; i < 6; i++) {
    fractalLines.push(new FractalLine());
  }
}

function draw() {
  // 動的背景
  drawDynamicBackground();

  translate(width / 2, height / 2);

  // グリッチエフェクトのランダム発生
  if (random(1000) < 1) {
    glitchEffect = true;
    glitchTimer = 30;
  }

  if (glitchEffect) {
    applyGlitchEffect();
    glitchTimer--;
    if (glitchTimer <= 0) glitchEffect = false;
  }

  // 万華鏡エフェクト - 6重対称
  for (let mirror = 0; mirror < 6; mirror++) {
    push();
    rotate((TWO_PI / 6) * mirror);

    // 対称性の片側だけ描画
    drawSymmetrySlice();

    pop();
  }

  // 中心のエネルギーコア
  drawEnergyCore();

  // 時間更新
  time += 0.015;

  // 背景にパーティクルシステム
  drawParticleSystem();
}

function initColorPalette() {
  colorPalette = [
    [320, 80, 95], // マゼンタ
    [280, 90, 100], // 紫
    [200, 85, 90], // シアン
    [60, 75, 95], // 黄色
    [30, 85, 100], // オレンジ
    [120, 70, 85], // 緑
  ];
}

function drawDynamicBackground() {
  // 複雑なグラデーション背景
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      let d = dist(x, y, width / 2, height / 2);
      let hue = (d * 0.5 + time * 50) % 360;
      let sat = 40 + sin(time * 2 + d * 0.01) * 20;
      let bright = 8 + sin(time + x * 0.01 + y * 0.01) * 5;

      fill(hue, sat, bright);
      noStroke();
      rect(x, y, 2, 2);
    }
  }
}

function drawSymmetrySlice() {
  // クリッピングマスクで片側だけ表示
  push();

  // フラクタルライン
  for (let line of fractalLines) {
    line.update();
    line.display();
  }

  // モーフィング図形
  for (let shape of morphingShapes) {
    shape.update();
    shape.display();
  }

  // エネルギーオーブ
  for (let orb of energyOrbs) {
    orb.update();
    orb.display();
  }

  pop();
}

class MorphingShape {
  constructor() {
    this.x = random(-200, 200);
    this.y = random(-200, 200);
    this.size = random(20, 80);
    this.colorIndex = floor(random(colorPalette.length));
    this.morphSpeed = random(0.5, 2);
    this.rotationSpeed = random(-0.05, 0.05);
    this.rotation = 0;
    this.vertices = floor(random(3, 8));
    this.pulsePhase = random(TWO_PI);
  }

  update() {
    // 軌道運動
    let orbit = 50 + sin(time * this.morphSpeed) * 30;
    this.x = cos(time * this.morphSpeed + this.pulsePhase) * orbit;
    this.y = sin(time * this.morphSpeed * 1.3 + this.pulsePhase) * orbit * 0.7;

    this.rotation += this.rotationSpeed;

    // 頂点数の変化
    this.vertices = 3 + floor(3 + sin(time * 0.7 + this.pulsePhase) * 2);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    let color = colorPalette[this.colorIndex];
    let pulse = 1 + sin(time * 3 + this.pulsePhase) * 0.3;
    let currentSize = this.size * pulse;

    // 外側のグロー
    for (let glow = 3; glow >= 1; glow--) {
      fill(color[0], color[1], color[2], 15 / glow);
      this.drawMorphingPolygon(currentSize * (1 + glow * 0.3));
    }

    // メインの図形
    fill(color[0], color[1], color[2], 70);
    this.drawMorphingPolygon(currentSize);

    pop();
  }

  drawMorphingPolygon(size) {
    beginShape();
    for (let i = 0; i <= this.vertices; i++) {
      let angle = map(i, 0, this.vertices, 0, TWO_PI);
      let r = size * (0.8 + 0.2 * sin(angle * 2 + time * 2));
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

class EnergyOrb {
  constructor() {
    this.radius = random(80, 150);
    this.speed = random(0.3, 0.8);
    this.colorIndex = floor(random(colorPalette.length));
    this.phase = random(TWO_PI);
    this.trailPoints = [];
  }

  update() {
    let angle = time * this.speed + this.phase;
    this.x = cos(angle) * this.radius;
    this.y = sin(angle * 1.4) * this.radius * 0.6;

    // トレイル記録
    this.trailPoints.push({ x: this.x, y: this.y });
    if (this.trailPoints.length > 20) {
      this.trailPoints.shift();
    }
  }

  display() {
    // トレイル描画
    for (let i = 0; i < this.trailPoints.length - 1; i++) {
      let alpha = map(i, 0, this.trailPoints.length, 0, 30);
      let color = colorPalette[this.colorIndex];
      stroke(color[0], color[1], color[2], alpha);
      strokeWeight(3);

      let p1 = this.trailPoints[i];
      let p2 = this.trailPoints[i + 1];
      line(p1.x, p1.y, p2.x, p2.y);
    }

    // オーブ本体
    push();
    translate(this.x, this.y);

    let color = colorPalette[this.colorIndex];
    let pulse = 1 + sin(time * 4 + this.phase) * 0.4;

    // 多重円でエネルギー感を演出
    for (let ring = 4; ring >= 1; ring--) {
      fill(color[0], color[1], color[2], 40 / ring);
      ellipse(0, 0, 20 * pulse * ring, 20 * pulse * ring);
    }

    pop();
  }
}

class FractalLine {
  constructor() {
    this.startAngle = random(TWO_PI);
    this.length = random(100, 200);
    this.colorIndex = floor(random(colorPalette.length));
    this.speed = random(0.5, 1.5);
    this.branches = [];

    // 分岐を生成
    for (let i = 0; i < 3; i++) {
      this.branches.push({
        angle: random(-PI / 3, PI / 3),
        length: this.length * random(0.3, 0.7),
        phase: random(TWO_PI),
      });
    }
  }

  update() {
    this.startAngle += 0.01 * this.speed;
  }

  display() {
    push();

    let color = colorPalette[this.colorIndex];
    stroke(color[0], color[1], color[2], 50);
    strokeWeight(2);

    // メインライン
    let endX = cos(this.startAngle + time * this.speed) * this.length;
    let endY = sin(this.startAngle + time * this.speed) * this.length;
    line(0, 0, endX, endY);

    // 分岐
    push();
    translate(endX, endY);
    for (let branch of this.branches) {
      let branchAngle =
        this.startAngle + branch.angle + sin(time * 2 + branch.phase) * 0.3;
      let branchEndX = cos(branchAngle) * branch.length;
      let branchEndY = sin(branchAngle) * branch.length;

      stroke(color[0], color[1], color[2], 30);
      line(0, 0, branchEndX, branchEndY);
    }
    pop();

    pop();
  }
}

function drawEnergyCore() {
  push();

  // 中心の複雑なエネルギーコア
  for (let layer = 0; layer < 5; layer++) {
    let rotation = time * (layer + 1) * 0.3;
    let size = 30 + layer * 15;

    push();
    rotate(rotation);

    let color = colorPalette[layer % colorPalette.length];
    fill(color[0], color[1], color[2], 20);

    beginShape();
    for (let i = 0; i <= 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let r = size * (1 + sin(angle * 3 + time * 4) * 0.3);
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  pop();
}

function drawParticleSystem() {
  // 背景パーティクル
  for (let i = 0; i < 150; i++) {
    let x = (noise(i * 0.1, time * 0.3) - 0.5) * width;
    let y = (noise(i * 0.1 + 100, time * 0.2) - 0.5) * height;

    let hue = (time * 30 + i * 3) % 360;
    let alpha = 20 + sin(time * 2 + i * 0.1) * 15;
    let size = 1 + sin(time * 3 + i * 0.2) * 1;

    fill(hue, 70, 90, alpha);
    noStroke();
    ellipse(x + width / 2, y + height / 2, size, size);
  }
}

function applyGlitchEffect() {
  // デジタルグリッチエフェクト
  push();

  for (let i = 0; i < 5; i++) {
    let y = random(height);
    let h = random(5, 20);

    tint(random(360), 80, 100, 80);
    copy(0, y, width, h, random(-10, 10), y + random(-5, 5), width, h);
  }

  noTint();
  pop();
}

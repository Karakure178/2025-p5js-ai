// サイケデリック幾何学模様アニメーション
let time = 0;
let geometricLayers = [];
let colorCycles = [];
let tunnelDepth = 20;
let pulseIntensity = 1;
let rotationMatrix = [];

function setup() {
  createCanvas(1000, 1000);
  colorMode(HSB, 360, 100, 100, 100);

  // 幾何学レイヤーを初期化
  initGeometricLayers();

  // カラーサイクルを初期化
  initColorCycles();

  // 回転マトリックスを初期化
  initRotationMatrix();
}

function draw() {
  // サイケデリック背景
  drawPsychedelicBackground();

  translate(width / 2, height / 2);

  // メインの幾何学トンネル
  drawGeometricTunnel();

  // 回転する多重幾何学
  drawRotatingGeometry();

  // フラクタル星座
  drawFractalConstellation();

  // 波紋エフェクト
  drawRippleEffect();

  // パルス効果の更新
  pulseIntensity = 1 + sin(time * 4) * 0.5;

  time += 0.02;
}

function initGeometricLayers() {
  geometricLayers = [];

  // 三角形レイヤー
  geometricLayers.push({
    type: "triangle",
    count: 12,
    baseSize: 100,
    rotationSpeed: 0.3,
    colorOffset: 0,
  });

  // 六角形レイヤー
  geometricLayers.push({
    type: "hexagon",
    count: 8,
    baseSize: 80,
    rotationSpeed: -0.2,
    colorOffset: 60,
  });

  // 正方形レイヤー
  geometricLayers.push({
    type: "square",
    count: 6,
    baseSize: 120,
    rotationSpeed: 0.15,
    colorOffset: 120,
  });

  // 八角形レイヤー
  geometricLayers.push({
    type: "octagon",
    count: 10,
    baseSize: 60,
    rotationSpeed: -0.4,
    colorOffset: 180,
  });
}

function initColorCycles() {
  colorCycles = [
    { hue: 0, satSpeed: 0.8, brightSpeed: 1.2 },
    { hue: 60, satSpeed: 1.1, brightSpeed: 0.9 },
    { hue: 120, satSpeed: 0.7, brightSpeed: 1.4 },
    { hue: 180, satSpeed: 1.3, brightSpeed: 0.8 },
    { hue: 240, satSpeed: 0.9, brightSpeed: 1.1 },
    { hue: 300, satSpeed: 1.0, brightSpeed: 1.0 },
  ];
}

function initRotationMatrix() {
  rotationMatrix = [];
  for (let i = 0; i < 5; i++) {
    rotationMatrix.push({
      angle: 0,
      speed: random(0.1, 0.5) * (random() > 0.5 ? 1 : -1),
      radius: 50 + i * 30,
    });
  }
}

function drawPsychedelicBackground() {
  // レイヤード・グラデーション背景
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      let d = dist(x, y, width / 2, height / 2);
      let angle = atan2(y - height / 2, x - width / 2);

      let hue = (d * 0.3 + angle * 57.3 + time * 100) % 360;
      let sat = 70 + sin(time * 2 + d * 0.01) * 30;
      let bright = 20 + sin(time * 3 + x * 0.01 + y * 0.01) * 15;

      // サイケデリックなノイズ効果
      bright += noise(x * 0.01, y * 0.01, time * 0.5) * 20;

      fill(hue, sat, bright);
      noStroke();
      rect(x, y, 3, 3);
    }
  }
}

function drawGeometricTunnel() {
  push();

  // 3Dトンネル効果
  for (let layer = tunnelDepth; layer > 0; layer--) {
    let progress = map(layer, 0, tunnelDepth, 0, 1);
    let scales = progress * pulseIntensity;
    let alpha = map(layer, 0, tunnelDepth, 100, 20);

    push();
    scale(scales);
    rotate(time * 0.5 + layer * 0.1);

    // 各幾何学レイヤーを描画
    for (let i = 0; i < geometricLayers.length; i++) {
      let layer_config = geometricLayers[i];
      let rotationOffset = time * layer_config.rotationSpeed + layer * 0.2;

      this.drawGeometricLayer(layer_config, rotationOffset, alpha, progress);
    }

    pop();
  }

  pop();
}

function drawGeometricLayer(config, rotationOffset, alpha, progress) {
  push();
  rotate(rotationOffset);

  for (let i = 0; i < config.count; i++) {
    let angle = (TWO_PI / config.count) * i;
    let radius = config.baseSize * progress;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    push();
    translate(x, y);
    rotate(angle + rotationOffset * 2);

    // サイケデリックカラー
    let colorIndex = floor(
      map(i + time * 2, 0, config.count, 0, colorCycles.length)
    );
    let colorCycle = colorCycles[colorIndex % colorCycles.length];

    let hue = (colorCycle.hue + time * 50 + config.colorOffset) % 360;
    let sat = 80 + sin(time * colorCycle.satSpeed + i) * 20;
    let bright = 70 + sin(time * colorCycle.brightSpeed + i * 0.5) * 30;

    fill(hue, sat, bright, alpha);
    stroke(hue, sat, 100, alpha * 0.5);
    strokeWeight(1);

    // 幾何学形状を描画
    this.drawShape(config.type, config.baseSize * 0.3 * progress);

    pop();
  }

  pop();
}

function drawShape(shapeType, size) {
  beginShape();

  let vertices;
  switch (shapeType) {
    case "triangle":
      vertices = 3;
      break;
    case "square":
      vertices = 4;
      break;
    case "hexagon":
      vertices = 6;
      break;
    case "octagon":
      vertices = 8;
      break;
    default:
      vertices = 6;
  }

  for (let i = 0; i <= vertices; i++) {
    let angle = map(i, 0, vertices, 0, TWO_PI);

    // 形状の歪み効果
    let warp = 1 + sin(time * 4 + angle * 3) * 0.1;
    let r = size * warp;

    let x = cos(angle) * r;
    let y = sin(angle) * r;
    vertex(x, y);
  }

  endShape(CLOSE);
}

function drawRotatingGeometry() {
  push();

  for (let matrix of rotationMatrix) {
    matrix.angle += matrix.speed * 0.02;

    push();
    rotate(matrix.angle);

    // 複数の同心円状配置
    for (let ring = 1; ring <= 3; ring++) {
      let ringRadius = matrix.radius * ring;
      let numShapes = 6 + ring * 2;

      for (let i = 0; i < numShapes; i++) {
        let angle = (TWO_PI / numShapes) * i;
        let x = cos(angle) * ringRadius;
        let y = sin(angle) * ringRadius;

        push();
        translate(x, y);
        rotate(time * 2 + i * 0.5);

        let hue = (time * 30 + i * 15 + ring * 60) % 360;
        let pulseSize = 8 + sin(time * 6 + i + ring) * 4;

        fill(hue, 90, 90, 60);
        stroke(hue, 100, 100, 80);
        strokeWeight(1);

        // 小さな幾何学形状
        if (ring % 2 === 0) {
          this.drawShape("triangle", pulseSize);
        } else {
          this.drawShape("square", pulseSize);
        }

        pop();
      }
    }

    pop();
  }

  pop();
}

function drawFractalConstellation() {
  push();

  // フラクタルパターンの星座
  for (let iteration = 0; iteration < 4; iteration++) {
    let scales = pow(0.6, iteration);
    let rotation = time * (iteration + 1) * 0.3;
    let numStars = 8 - iteration * 2;

    push();
    rotate(rotation);
    scale(scales);

    for (let i = 0; i < numStars; i++) {
      let angle = (TWO_PI / numStars) * i;
      let radius = 200;

      let x = cos(angle) * radius;
      let y = sin(angle) * radius;

      push();
      translate(x, y);

      // 星形パターン
      this.drawStar(20 + iteration * 10, iteration);

      pop();
    }

    pop();
  }

  pop();
}

function drawStar(size, colorOffset) {
  push();

  let hue = (time * 40 + colorOffset * 90) % 360;
  let brightness = 80 + sin(time * 5 + colorOffset) * 20;

  fill(hue, 80, brightness, 70);
  stroke(hue, 100, 100, 90);
  strokeWeight(1);

  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 10, 0, TWO_PI);
    let radius = i % 2 === 0 ? size : size * 0.5;

    // 星の形状に動的な歪み
    radius *= 1 + sin(time * 8 + i) * 0.2;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);

  pop();
}

function drawRippleEffect() {
  push();

  // 同心円の波紋エフェクト
  for (let i = 0; i < 8; i++) {
    let radius = (time * 100 + i * 50) % 400;
    let alpha = map(radius, 0, 400, 80, 0);

    let hue = (time * 20 + i * 45) % 360;

    noFill();
    stroke(hue, 70, 90, alpha);
    strokeWeight(2 + sin(time * 3 + i) * 1);

    // 波紋の歪み
    beginShape();
    for (let angle = 0; angle <= TWO_PI + 0.1; angle += 0.1) {
      let r = radius + sin(angle * 8 + time * 4) * 10;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape();
  }

  pop();
}

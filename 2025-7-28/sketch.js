// 湿っぽい静止画 - 雨の窓辺の風景
let raindrops = [];
let fogPatches = [];
let glassTexture = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);

  // 雨粒を生成
  generateRaindrops();

  // 霧のパッチを生成
  generateFogPatches();

  // ガラスのテクスチャを生成
  generateGlassTexture();

  // 一度だけ描画するのでnoLoop()を呼ぶ
  noLoop();
}

function draw() {
  // 基本の背景 - 重い雲の色
  drawBackground();

  // 遠景の建物や木々
  drawDistantLandscape();

  // 霧と湿気
  drawFogAndMoisture();

  // 窓ガラスのテクスチャ
  drawGlassTexture();

  // 雨粒
  drawRaindrops();

  // 水滴の軌跡
  drawWaterTrails();

  // 全体的な湿っぽいフィルター
  applyMoistureFilter();
}

function generateRaindrops() {
  raindrops = [];
  for (let i = 0; i < 150; i++) {
    raindrops.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      opacity: random(30, 80),
      type: random() > 0.7 ? "large" : "small",
    });
  }
}

function generateFogPatches() {
  fogPatches = [];
  for (let i = 0; i < 20; i++) {
    fogPatches.push({
      x: random(-50, width + 50),
      y: random(-50, height + 50),
      size: random(100, 300),
      opacity: random(10, 30),
      density: random(0.5, 1.5),
    });
  }
}

function generateGlassTexture() {
  glassTexture = [];
  for (let i = 0; i < 500; i++) {
    glassTexture.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      opacity: random(5, 20),
    });
  }
}

function drawBackground() {
  // グラデーション背景 - 重い雲の日
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);

    // 湿っぽいグレーから暗いブルーグレー
    let hue = 200 + sin(t * PI) * 20;
    let saturation = 20 + t * 15;
    let brightness = 35 - t * 20;

    stroke(hue, saturation, brightness);
    line(0, y, width, y);
  }
}

function drawDistantLandscape() {
  // 遠くの建物のシルエット（ぼやけて見える）
  push();

  // 建物群
  for (let i = 0; i < 8; i++) {
    let x = map(i, 0, 7, 0, width);
    let buildingHeight = random(50, 150);
    let buildingWidth = random(40, 80);

    // 湿気でぼやけた建物
    fill(210, 25, 25, 40);
    noStroke();
    rect(x, height - buildingHeight, buildingWidth, buildingHeight);

    // さらにぼやけた効果
    fill(210, 15, 35, 20);
    rect(
      x - 5,
      height - buildingHeight - 5,
      buildingWidth + 10,
      buildingHeight + 10
    );
  }

  // 遠くの木々
  for (let i = 0; i < 12; i++) {
    let x = random(width);
    let treeHeight = random(30, 80);

    fill(120, 40, 20, 30);
    noStroke();
    ellipse(x, height - treeHeight / 2, 25, treeHeight);
  }

  pop();
}

function drawFogAndMoisture() {
  push();

  // 霧のパッチ
  for (let fog of fogPatches) {
    fill(200, 20, 60, fog.opacity);
    noStroke();

    // 複数の円で霧の効果を作る
    for (let layer = 0; layer < 3; layer++) {
      let layerSize = fog.size * (1 + layer * 0.3);
      let layerOpacity = fog.opacity / (layer + 1);

      fill(200 + layer * 10, 15, 50 + layer * 10, layerOpacity);
      ellipse(fog.x, fog.y, layerSize, layerSize * 0.6);
    }
  }

  // 湿気による空気の歪み
  for (let i = 0; i < 30; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 60);

    fill(200, 10, 45, 8);
    noStroke();
    ellipse(x, y, size, size);
  }

  pop();
}

function drawGlassTexture() {
  push();

  // 窓ガラスの細かいテクスチャ
  for (let texture of glassTexture) {
    fill(180, 30, 70, texture.opacity);
    noStroke();
    ellipse(texture.x, texture.y, texture.size, texture.size);
  }

  // ガラス表面の反射
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(10, 40);
    let h = random(2, 8);

    fill(200, 40, 85, random(10, 25));
    noStroke();
    rect(x, y, w, h);
  }

  pop();
}

function drawRaindrops() {
  push();

  for (let drop of raindrops) {
    push();
    translate(drop.x, drop.y);

    if (drop.type === "large") {
      // 大きな水滴
      fill(200, 30, 85, drop.opacity);
      stroke(200, 50, 95, drop.opacity * 1.5);
      strokeWeight(0.5);

      // 水滴の形状
      beginShape();
      vertex(0, -drop.size);
      bezierVertex(
        -drop.size * 0.7,
        -drop.size * 0.3,
        -drop.size * 0.7,
        drop.size * 0.3,
        0,
        drop.size
      );
      bezierVertex(
        drop.size * 0.7,
        drop.size * 0.3,
        drop.size * 0.7,
        -drop.size * 0.3,
        0,
        -drop.size
      );
      endShape(CLOSE);

      // 水滴の光の反射
      fill(180, 20, 95, drop.opacity * 0.8);
      noStroke();
      ellipse(
        -drop.size * 0.3,
        -drop.size * 0.4,
        drop.size * 0.3,
        drop.size * 0.2
      );
    } else {
      // 小さな水滴
      fill(200, 25, 80, drop.opacity);
      stroke(200, 40, 90, drop.opacity * 1.2);
      strokeWeight(0.3);
      ellipse(0, 0, drop.size, drop.size);

      // 小さな光の点
      fill(180, 15, 90, drop.opacity * 0.6);
      noStroke();
      ellipse(
        -drop.size * 0.2,
        -drop.size * 0.2,
        drop.size * 0.2,
        drop.size * 0.2
      );
    }

    pop();
  }

  pop();
}

function drawWaterTrails() {
  push();

  // 水滴が流れた軌跡
  for (let i = 0; i < 25; i++) {
    let startX = random(width);
    let startY = random(50, height * 0.3);
    let length = random(30, 150);

    stroke(200, 35, 75, random(15, 40));
    strokeWeight(random(0.5, 2));

    // 蛇行する水の軌跡
    let currentX = startX;
    let currentY = startY;

    beginShape();
    noFill();
    vertex(currentX, currentY);

    for (let step = 0; step < length; step += 5) {
      currentY += 5;
      currentX += random(-2, 2);

      // 時々大きく曲がる
      if (random() < 0.1) {
        currentX += random(-8, 8);
      }

      vertex(currentX, currentY);
    }
    endShape();

    // 軌跡の終点に小さな水たまり
    fill(200, 40, 70, 20);
    noStroke();
    ellipse(currentX, currentY, random(3, 8), random(2, 4));
  }

  pop();
}

function applyMoistureFilter() {
  push();

  // 全体に湿っぽいフィルターをかける
  fill(210, 25, 50, 15);
  noStroke();
  rect(0, 0, width, height);

  // コントラストを下げる効果
  fill(200, 15, 40, 8);
  rect(0, 0, width, height);

  // 雨の日の特有のブルーがかったトーン
  fill(220, 30, 60, 12);
  rect(0, 0, width, height);

  pop();
}

// マウスクリックで再生成
function mousePressed() {
  generateRaindrops();
  generateFogPatches();
  generateGlassTexture();
  redraw();
}

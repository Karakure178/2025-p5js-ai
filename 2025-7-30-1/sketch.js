const colors = [];
const colorSelect = ["#B9375D", "#D25D5D", "#E7D3D3", "#8B1538", "#F5A3B7"];
let numShapes = 12;
let rotationOffsets = [];
let pulseOffsets = [];

function setup() {
  createCanvas(800, 800, WEBGL);
  rectMode(CENTER);
  noStroke();

  // 各形状にランダムな回転とパルスオフセットを設定
  for (let i = 0; i < numShapes; i++) {
    colors.push([]);
    rotationOffsets.push([]);
    pulseOffsets.push([]);
    for (let j = 0; j < numShapes; j++) {
      colors[i].push(random(colorSelect));
      rotationOffsets[i].push(random(TWO_PI));
      pulseOffsets[i].push(random(TWO_PI));
    }
  }
}

function draw() {
  // ダークでクールな背景
  background(15, 15, 25);

  // 環境光とディレクショナルライト
  ambientLight(30);
  directionalLight(100, 100, 120, -1, 0.5, -1);

  translate(-width / 2, -height / 2);

  let spacing = min(width, height) / numShapes;
  let time = frameCount * 0.02;

  for (let i = 0; i < numShapes; i++) {
    for (let j = 0; j < numShapes; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      let d = dist(width / 2, height / 2, x, y);
      let normalizedD = d / (width * 0.5);

      // 複雑な波動効果
      let wave1 = sin(d * 0.03 + time * 3);
      let wave2 = cos(d * 0.05 + time * 2);
      let wave3 = sin(normalizedD * PI + time * 4);

      let size = map(
        wave1 * wave2 + wave3 * 0.3,
        -1.5,
        1.5,
        spacing * 0.1,
        spacing * 0.9
      );

      // 色の動的変化
      let colorIndex = floor(
        map(sin(d * 0.02 + time * 2), -1, 1, 0, colorSelect.length)
      );
      let currentColor = color(colorSelect[colorIndex]);

      // 輝度の動的変化
      let brightness = map(sin(d * 0.04 + time * 1.5), -1, 1, 0.3, 1.2);
      currentColor = lerpColor(color(0), currentColor, brightness);

      push();
      translate(x, y);

      // 複雑な回転
      let rotationSpeed = map(normalizedD, 0, 1, 0.005, 0.02);
      rotateX(time * rotationSpeed + rotationOffsets[i][j]);
      rotateY(time * rotationSpeed * 1.3 + rotationOffsets[i][j] * 0.7);
      rotateZ(time * rotationSpeed * 0.5);

      fill(currentColor);

      // 形状の種類を距離に応じて変更
      if (normalizedD < 0.3) {
        // 中心部：立方体
        box(size);
      } else if (normalizedD < 0.6) {
        // 中間部：球体
        sphere(size * 0.5);
      } else {
        // 外側：平面の四角形 + グロー効果
        rect(0, 0, size, size);

        // グロー効果
        push();
        fill(red(currentColor), green(currentColor), blue(currentColor), 30);
        rect(0, 0, size * 1.5, size * 1.5);
        pop();
      }

      pop();
    }
  }

  // 全体に微細なノイズエフェクト
  //addNoiseEffect();
}

function addNoiseEffect() {
  // 微細なパーティクル効果
  push();
  translate(-width / 2, -height / 2);

  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let z = random(-100, 100);

    let alpha = map(sin(frameCount * 0.1 + i), -1, 1, 10, 60);

    push();
    translate(x, y, z);
    fill(255, alpha);
    noStroke();
    sphere(random(1, 3));
    pop();
  }

  pop();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
  }

  // スペースキーで色パレットをランダム変更
  if (key === " ") {
    let newColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    if (random() > 0.5) {
      newColors = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe"];
    }
    colorSelect.splice(0, colorSelect.length, ...newColors);
  }
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

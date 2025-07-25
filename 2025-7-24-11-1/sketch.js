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
}

function draw() {
  translate(width / 2, height / 2);

  drawRippleEffect();

  // パルス効果の更新
  pulseIntensity = 1 + sin(time * 4) * 0.5;

  time += 0.02;
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

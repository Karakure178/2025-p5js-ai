// Global settings
let stars = [];
const numStars = 800; // 星の数を増やす
let speed;

// Rotation and color properties
let angle = 0;
let hueValue = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100); // HSBカラーモードを使用
  strokeCap(ROUND); // 線の先端を丸くする

  // 星を初期化
  for (let i = 0; i < numStars; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  background(0, 0, 0, 25); // 残像効果のある黒い背景

  // サイン波で速度を脈動させる
  speed = map(sin(frameCount * 0.02), -1, 1, 2, 25);

  // 色相を時間で変化させて虹色にする
  hueValue = (hueValue + 0.5) % 360;

  translate(width / 2, height / 2); // 座標系の中心を画面中央に
  
  // グロー（発光）エフェクト
  drawingContext.shadowBlur = 32;
  drawingContext.shadowColor = color(hueValue, 80, 100);

  // 全ての星を更新して描画
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Star {
  constructor() {
    this.init();
  }

  // 星の位置や色を初期化（リセット）
  init() {
    this.x = random(-width * 1.5, width * 1.5);
    this.y = random(-height * 1.5, height * 1.5);
    this.z = random(width);
    this.pz = this.z; // 軌跡を描くための前のZ座標
    // 現在の色相に近い色をランダムに割り当てる
    this.hue = random(hueValue - 20, hueValue + 20);
  }

  update() {
    this.z -= speed;
    // 星がカメラの後ろに行ったらリセット
    if (this.z < 1) {
      this.init();
    }
  }

  show() {
    // 3D座標を2Dスクリーンに投影
    let sx = map(this.x / this.z, -1, 1, -width, width);
    let sy = map(this.y / this.z, -1, 1, -height, height);

    // 距離に応じて大きさを変える
    let r = map(this.z, 0, width, 8, 0);

    // 軌跡を描くために前の位置も投影
    let px = map(this.x / this.pz, -1, 1, -width, width);
    let py = map(this.y / this.pz, -1, 1, -height, height);

    this.pz = this.z; // 前のZ座標を更新

    // 星の色と軌跡の太さを設定
    strokeWeight(r);
    stroke(this.hue, 90, 100, 50); // 明るく彩度の高い色（少し透明）
    line(px, py, sx, sy); // 軌跡を描画
  }
}
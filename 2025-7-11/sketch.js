let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(0, 50); // 少し透明な黒で背景を塗り、軌跡を残す

  // マウスの位置に新しいパーティクルを追加
  for (let i = 0; i < 5; i++) {
    let p = new Particle(mouseX, mouseY);
    particles.push(p);
  }

  // すべてのパーティクルを更新・表示
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      // 寿命が尽きたパーティクルを配列から削除
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // ランダムな方向への速度
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    // ランダムな色 (HSBカラーモードを使用)
    this.color = color(random(360), 90, 90, 0.8);
    // 寿命
    this.lifespan = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    // 寿命を減らす
    this.lifespan -= 4;
  }

  show() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    ellipse(this.x, this.y, 12, 12);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// パーティクルが繋がったり繋がらなかったりするアニメーション

let particles = []; // パーティクルの配列
let numParticles = 80; // パーティクルの数
let maxDistance = 120; // 線を引く最大距離

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent("canvas-container");

  // パーティクルを初期化
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 10, 15, 30); // 残像効果のため少し透明度を持たせる

  // パーティクル間の距離を計算して線を引く
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(
        particles[i].pos.x,
        particles[i].pos.y,
        particles[j].pos.x,
        particles[j].pos.y
      );

      // 距離が近いほど線を太く、明るく
      if (d < maxDistance) {
        let alpha = map(d, 0, maxDistance, 255, 0);
        let weight = map(d, 0, maxDistance, 2, 0.2);

        stroke(100, 150, 255, alpha);
        strokeWeight(weight);
        line(
          particles[i].pos.x,
          particles[i].pos.y,
          particles[j].pos.x,
          particles[j].pos.y
        );
      }
    }
  }

  // パーティクルを更新して描画
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

// パーティクルクラス
class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.size = random(3, 8);
  }

  update() {
    // ランダムな力を加える
    let randomForce = p5.Vector.random2D().mult(0.1);
    this.acc.add(randomForce);

    // 速度を更新
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);

    // 加速度をリセット
    this.acc.mult(0);

    // 画面端で跳ね返る
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
      this.pos.x = constrain(this.pos.x, 0, width);
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
      this.pos.y = constrain(this.pos.y, 0, height);
    }
  }

  display() {
    noStroke();
    fill(150, 200, 255, 200);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

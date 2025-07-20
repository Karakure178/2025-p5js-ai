let particles = [];
let num = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  num = Math.floor(random(2, 5));
}

function draw() {
  background(0, 50); // 少し透明な黒で背景を塗り、軌跡を残す
  // マウスの位置に新しいパーティクルを追加
  for (let i = 0; i < num; i++) {
    let p = grid(num);
    particles.push(p);
  }
  //blendMode(SCREEN);
  // すべてのパーティクルを更新・表示
  for (let i = particles.length - 1; i >= 0; i--) {
    for (let j = 0; j < particles[i].length; j++) {
      particles[i][j].update();
      particles[i][j].show();
      if (particles[i][j].isFinished()) {
        // 寿命が尽きたパーティクルを配列から削除
        particles[i].splice(i, 1);
        break;
      }
    }
  }
  filter(BLUR, 6);
  filter(POSTERIZE, 1 / (1 / 6.5));

  //blendMode(BLEND);
}

/** num個で分割したグリッドを画面いっぱいに生成する
 * @method grid
 * @param  {Number}        num           画面の分割数
 */
const grid = (num, colors) => {
  const n1 = num + 1;

  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;

  const nw = width / n1;
  const nh = height / n1;
  const particles = [];

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      // fill(random(colors));
      // circle(x + nw / 2, y + nw / 2, random(nw / 2, nw));
      let p = new Particle(x + nw / 2, y + nh / 2);
      particles.push(p);
    }
  }
  return particles;
};

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
    fill(
      this.color.levels[0],
      this.color.levels[1],
      this.color.levels[2],
      this.lifespan
    );
    ellipse(this.x, this.y, 12, 12);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

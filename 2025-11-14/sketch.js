// 紅葉をイメージした静止画
// 秋の色彩と落ち葉を表現

// 紅葉の色パレット
const colors = [
  "#8B0000", // 深紅
  "#DC143C", // クリムゾン
  "#FF4500", // オレンジレッド
  "#FF8C00", // ダークオレンジ
  "#FFD700", // ゴールド
  "#DAA520", // ゴールデンロッド
  "#B8860B", // ダークゴールデンロッド
  "#8B4513", // サドルブラウン
];

let leaves = []; // 紅葉の配列

// =====================
// Leaf クラス（紅葉）
// =====================
class Leaf {
  constructor(x, y, size, rotation, colorHex) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.rotation = rotation;
    this.color = colorHex;
  }

  // 紅葉を描画（モミジの形状）
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    // 影を描画
    this.drawLeafShape(3, 3, color(0, 0, 0, 60));

    // 本体を描画
    this.drawLeafShape(0, 0, color(this.color));

    // 葉脈を描画
    this.drawVeins();

    pop();
  }

  // モミジの葉の形状を描画
  drawLeafShape(offsetX, offsetY, col) {
    push();
    translate(offsetX, offsetY);
    fill(col);
    noStroke();

    // モミジは5〜7つの尖った葉を持つ
    // シンプルな星型で表現
    beginShape();
    const numPoints = 7; // 7つの尖り
    for (let i = 0; i < numPoints * 2; i++) {
      const angle = (i * PI) / numPoints - PI / 2;
      let r;
      if (i % 2 === 0) {
        // 外側の尖り
        r = this.size;
      } else {
        // 内側のくぼみ
        r = this.size * 0.4;
      }
      const x = cos(angle) * r;
      const y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }

  // 葉脈を描画
  drawVeins() {
    push();
    stroke(0, 0, 0, 80);
    strokeWeight(1);

    // 中央の葉脈
    line(0, 0, 0, -this.size * 0.8);

    // 放射状の葉脈
    const numVeins = 7;
    for (let i = 0; i < numVeins; i++) {
      const angle = map(i, 0, numVeins - 1, -PI / 2.5, PI / 2.5) - PI / 2;
      const veinLength = this.size * 0.6;
      const x = cos(angle) * veinLength;
      const y = sin(angle) * veinLength;
      line(0, 0, x, y);
    }
    pop();
  }

  // ランダム生成ヘルパー
  static random() {
    const x = random(width);
    const y = random(height);
    const size = random(15, 45);
    const rotation = random(TWO_PI);
    const leafColor = random(colors);
    return new Leaf(x, y, size, rotation, leafColor);
  }
}

function setup() {
  const c = createCanvas(800, 800);
  c.parent("canvas-container");

  // 紅葉を生成
  generateLeaves();

  noLoop(); // 静止画
}

// 紅葉をランダムに生成
function generateLeaves() {
  leaves = [];

  // 背景に散らばる紅葉（60〜100枚）
  const numLeaves = int(random(60, 100));

  for (let i = 0; i < numLeaves; i++) {
    leaves.push(Leaf.random());
  }
}

function draw() {
  // 秋の空のグラデーション背景
  drawSkyGradient();

  // 全ての紅葉を描画
  for (const leaf of leaves) {
    leaf.display();
  }
}

// 秋の空のグラデーション
function drawSkyGradient() {
  // 上から下へのグラデーション
  for (let y = 0; y < height; y++) {
    const inter = map(y, 0, height, 0, 1);
    const c = lerpColor(color(135, 170, 200), color(245, 222, 179), inter);
    stroke(c);
    line(0, y, width, y);
  }
}

// クリックで再生成
function mousePressed() {
  generateLeaves();
  redraw();
}

// キーボード操作
function keyPressed() {
  if (key === "r" || key === "R") {
    // 再生成
    generateLeaves();
    redraw();
  }
}

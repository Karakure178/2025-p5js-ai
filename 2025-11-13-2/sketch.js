// 筆で描いたような四角形をクラス化して量産

let brushRects = []; // 四角形の配列

// =====================
// BrushRect クラス定義
// =====================
class BrushRect {
  constructor(x, y, w, h, rotation = 0) {
    this.x = x; // X座標
    this.y = y; // Y座標
    this.w = w; // 幅
    this.h = h; // 高さ
    this.rotation = rotation; // 回転角度（ラジアン）
  }

  // 四角形を描画
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);

    // 筆のにじみと掠れを表現
    noFill();
    strokeWeight(8);

    // 四辺を個別に描画して筆のタッチを表現
    const corners = [
      [-this.w / 2, -this.h / 2], // 左上
      [this.w / 2, -this.h / 2], // 右上
      [this.w / 2, this.h / 2], // 右下
      [-this.w / 2, this.h / 2], // 左下
    ];

    // 各辺を筆のタッチで描く
    for (let i = 0; i < 4; i++) {
      const start = corners[i];
      const end = corners[(i + 1) % 4];
      this.drawBrushStroke(start[0], start[1], end[0], end[1]);
    }

    pop();
  }

  // 筆タッチの線を描画（掠れや揺らぎを表現）
  drawBrushStroke(x1, y1, x2, y2) {
    // 複数の薄い線を重ねて筆の質感を出す
    const layers = 15; // レイヤー数

    for (let layer = 0; layer < layers; layer++) {
      beginShape();

      // 透明度と太さを変えて重ねる
      const alpha = map(layer, 0, layers - 1, 5, 40);
      stroke(40, 40, 50, alpha);

      const segments = 50; // 線の分割数
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = lerp(x1, x2, t);
        const y = lerp(y1, y2, t);

        // ランダムな揺らぎで筆の掠れを表現
        const offsetX = randomGaussian(0, 3 - layer * 0.15);
        const offsetY = randomGaussian(0, 3 - layer * 0.15);

        // 筆圧の変化を模倣（両端が薄い）
        const pressure = sin(t * PI);
        const finalOffsetX = offsetX * pressure;
        const finalOffsetY = offsetY * pressure;

        vertex(x + finalOffsetX, y + finalOffsetY);
      }

      endShape();
    }
  }

  // ランダム生成ヘルパー
  static random() {
    const x = random(150, width - 150);
    const y = random(150, height - 150);
    const w = random(150, 350);
    const h = random(150, 350);
    const rotation = random(-PI / 12, PI / 12); // ±15度
    return new BrushRect(x, y, w, h, rotation);
  }
}

function setup() {
  const c = createCanvas(800, 800);
  c.parent("canvas-container");

  // 初期状態：中央に1つ配置
  brushRects.push(new BrushRect(width / 2, height / 2, 400, 400));

  noLoop(); // 静止画
}

function draw() {
  background(245, 242, 235); // 和紙のような背景色

  // 全ての四角形を描画
  for (const rect of brushRects) {
    rect.display();
  }
}

// クリックで新しい四角形を追加
function mousePressed() {
  // クリック位置に新しい四角形を追加
  const w = random(100, 300);
  const h = random(100, 300);
  const rotation = random(-PI / 8, PI / 8);
  brushRects.push(new BrushRect(mouseX, mouseY, w, h, rotation));

  redraw();
}

// キーボードでランダム配置
function keyPressed() {
  if (key === "r" || key === "R") {
    // ランダムな四角形を追加
    brushRects.push(BrushRect.random());
    redraw();
  } else if (key === "c" || key === "C") {
    // クリア
    brushRects = [];
    brushRects.push(new BrushRect(width / 2, height / 2, 400, 400));
    redraw();
  }
}

// 筆で描いたような四角形を真ん中に配置

function setup() {
  const c = createCanvas(800, 800);
  c.parent("canvas-container");
  noLoop(); // 静止画
}

function draw() {
  background(245, 242, 235); // 和紙のような背景色

  // 画面中央に筆タッチの四角形を描画
  drawBrushRect(width / 2, height / 2, 400, 400);
}

// 筆タッチの四角形を描画する関数
function drawBrushRect(x, y, w, h) {
  push();
  translate(x, y);

  // 筆のにじみと掠れを表現
  noFill();
  strokeWeight(8);

  // 四辺を個別に描画して筆のタッチを表現
  const corners = [
    [-w / 2, -h / 2], // 左上
    [w / 2, -h / 2], // 右上
    [w / 2, h / 2], // 右下
    [-w / 2, h / 2], // 左下
  ];

  // 各辺を筆のタッチで描く
  for (let i = 0; i < 4; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % 4];
    drawBrushStroke(start[0], start[1], end[0], end[1]);
  }

  pop();
}

// 筆タッチの線を描画（掠れや揺らぎを表現）
function drawBrushStroke(x1, y1, x2, y2) {
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

// クリックで再描画
function mousePressed() {
  redraw();
}

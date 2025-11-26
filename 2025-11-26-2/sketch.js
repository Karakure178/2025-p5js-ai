// 曲線に沿ってグラデーションさせた円を配置

let circles = []; // 円の配列
let numCircles = 500; // 円の数を大幅に増やす
let circleSize = 15; // 円のサイズを固定

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent("canvas-container");
  noStroke();

  // 曲線に沿って円を密に配置
  for (let i = 0; i < numCircles; i++) {
    let t = i / numCircles; // 0〜1の範囲

    // サインカーブに沿った位置
    let x = map(t, 0, 1, 100, 700);
    let y = 400 + sin(t * TWO_PI * 3) * 150; // 3周期の波

    // グラデーション用の色（HSB色空間）
    let hue = map(t, 0, 1, 0, 360);

    circles.push({
      x: x,
      y: y,
      hue: hue,
      t: t,
    });
  }
}

function draw() {
  background(20);

  colorMode(HSB, 360, 100, 100, 100);

  // 円を描画（ガイドラインなし、みっちり詰めて表示）
  noStroke();
  for (let circle of circles) {
    // グラデーション色（鮮やかに）
    fill(circle.hue, 90, 95);
    ellipse(circle.x, circle.y, circleSize, circleSize);
  }

  colorMode(RGB, 255);
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("gradient-curve", "png");
  }
}

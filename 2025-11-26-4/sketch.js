// 曲線に沿ってグラデーションさせた円を配置

let curves = []; // 複数の曲線を格納
let numCurves = 5; // 曲線の数
let numCircles = 300; // 各曲線の円の数
let noiseScale = 0.003; // ノイズのスケール
let noiseStrength = 150; // ノイズの強度

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent("canvas-container");
  noStroke();

  // 各曲線のグラデーション色設定
  let colorPairs = [
    { start: color('#ffffff'), end: color('#ff22f3') }, // 白 → マゼンタ
    { start: color('#00ffff'), end: color('#0000ff') }, // シアン → 青
    { start: color('#ffff00'), end: color('#ff0000') }, // 黄 → 赤
    { start: color('#00ff00'), end: color('#004400') }, // 緑 → 濃緑
    { start: color('#ff8800'), end: color('#8800ff') }, // オレンジ → 紫
  ];

  // 複数の曲線を生成
  for (let curveIndex = 0; curveIndex < numCurves; curveIndex++) {
    let circles = [];
    let yOffset = map(curveIndex, 0, numCurves - 1, 200, 600); // 各曲線のY位置
    let noiseOffset = random(1000); // 各曲線に異なるノイズオフセット
    let colors = colorPairs[curveIndex]; // この曲線のグラデーション色

    // ノイズを使った曲線に沿って円を密に配置
    for (let i = 0; i < numCircles; i++) {
      let t = i / numCircles; // 0〜1の範囲

      // X座標は線形
      let x = map(t, 0, 1, 100, 700);

      // Y座標はパーリンノイズで生成
      let noiseValue = noise(noiseOffset + i * noiseScale);
      let y = map(
        noiseValue,
        0,
        1,
        yOffset - noiseStrength,
        yOffset + noiseStrength
      );

      circles.push({
        x: x,
        y: y,
        t: t,
        size: random(8, 15), // サイズをランダムに
        startColor: colors.start,
        endColor: colors.end,
      });
    }

    curves.push(circles);
  }
}

function draw() {
  background(20);

  // 全ての曲線を描画
  noStroke();
  for (let circles of curves) {
    for (let circle of circles) {
      // 各円固有の開始色から終了色へのグラデーション
      let gradientColor = lerpColor(circle.startColor, circle.endColor, circle.t);

      // 半透明にして重なりを表現
      gradientColor.setAlpha(200);
      fill(gradientColor);

      ellipse(circle.x, circle.y, circle.size, circle.size);
    }
  }
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("gradient-curve", "png");
  }
}

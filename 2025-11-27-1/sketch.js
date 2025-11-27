// 回転する1/4のドーナツ

let angle = 0;

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  background(20);

  // ライティング設定
  ambientLight(50);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);

  // 回転
  rotateX(angle * 0.5);
  rotateY(angle);
  rotateZ(angle * 0.3);

  // ドーナツの1/4を描画（セグメント数を減らして軽量化）
  drawQuarterDonut(200, 80, 20);

  angle += 0.01;
}

// 1/4ドーナツを描画する関数
function drawQuarterDonut(outerRadius, innerRadius, segments) {
  push();

  // カラフルな色
  let hue = (frameCount * 0.5) % 360;
  fill(hue, 80, 90);
  noStroke(); // ストロークを無効化して高速化

  // 1/4の円弧部分のみ描画（0度から90度）
  let angleStart = 0;
  let angleEnd = HALF_PI; // 90度
  let angleStep = angleEnd / segments;

  // トーラス形状を作成
  for (let i = 0; i < segments; i++) {
    let theta1 = angleStart + angleStep * i;
    let theta2 = angleStart + angleStep * (i + 1);

    // 円周方向の分割
    for (let j = 0; j < segments; j++) {
      let phi1 = (TWO_PI / segments) * j;
      let phi2 = (TWO_PI / segments) * (j + 1);

      // 4つの頂点で四角形を作成（TRIANGLE_STRIPで高速化）
      let v1 = getTorusPoint(outerRadius, innerRadius, theta1, phi1);
      let v2 = getTorusPoint(outerRadius, innerRadius, theta2, phi1);
      let v3 = getTorusPoint(outerRadius, innerRadius, theta2, phi2);
      let v4 = getTorusPoint(outerRadius, innerRadius, theta1, phi2);

      beginShape(QUADS);
      vertex(v1.x, v1.y, v1.z);
      vertex(v2.x, v2.y, v2.z);
      vertex(v3.x, v3.y, v3.z);
      vertex(v4.x, v4.y, v4.z);
      endShape();
    }
  }

  pop();
}

// トーラス上の点を計算
function getTorusPoint(outerRadius, innerRadius, theta, phi) {
  let r = outerRadius + innerRadius * cos(phi);
  let x = r * cos(theta);
  let y = r * sin(theta);
  let z = innerRadius * sin(phi);

  return { x: x, y: y, z: z };
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("quarter-donut", "png");
  }
}

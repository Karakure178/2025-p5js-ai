// 回転する1/4のドーナツをいっぱい並べる

let angle = 0;
let donuts = [];

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  colorMode(HSB, 360, 100, 100, 100);
  
  // ドーナツのかけらを複数生成
  for (let i = 0; i < 12; i++) {
    donuts.push({
      x: random(-400, 400),
      y: random(-400, 400),
      z: random(-400, 400),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      speedX: random(0.005, 0.02),
      speedY: random(0.005, 0.02),
      speedZ: random(0.005, 0.02),
      hue: random(360),
      size: random(0.3, 0.8)
    });
  }
}

function draw() {
  background(20);

  // ライティング設定（簡略化）
  ambientLight(100);

  // 各ドーナツのかけらを描画
  for (let donut of donuts) {
    push();
    
    // 位置を設定
    translate(donut.x, donut.y, donut.z);
    
    // 回転
    rotateX(donut.rotX);
    rotateY(donut.rotY);
    rotateZ(donut.rotZ);
    
    // サイズを適用
    scale(donut.size);
    
    // ドーナツの1/4を描画
    drawQuarterDonut(100, 40, 8, donut.hue);
    
    // 回転を更新
    donut.rotX += donut.speedX;
    donut.rotY += donut.speedY;
    donut.rotZ += donut.speedZ;
    
    pop();
  }
  
  angle += 0.01;
}

// 1/4ドーナツを描画する関数
function drawQuarterDonut(outerRadius, innerRadius, segments, hue) {
  push();

  // カラフルな色
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

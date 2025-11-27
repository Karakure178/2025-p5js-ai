// 回転する1/4のドーナツと毛糸を組み合わせる

let angle = 0;
let donuts = [];
let yarns = [];

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  colorMode(HSB, 360, 100, 100, 100);

  // ドーナツのかけらを複数生成（グリッド配置）
  let gridSize = 4; // 4列
  let gridRows = 3; // 3行
  let spacing = 200;
  let index = 0;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridRows; j++) {
      if (index >= 12) break;

      // 中心に配置するように座標を計算
      let x = (i - (gridSize - 1) / 2) * spacing;
      let y = (j - (gridRows - 1) / 2) * spacing;

      donuts.push({
        x: x,
        y: y,
        z: 0,
        rotX: random(TWO_PI),
        rotY: random(TWO_PI),
        rotZ: random(TWO_PI),
        speedX: random(0.005, 0.02),
        speedY: random(0.005, 0.02),
        speedZ: random(0.005, 0.02),
        hue: random(360),
        size: random(0.4, 1.2),
      });
      index++;
    }
  }

  // ドーナツ間を毛糸で繋ぐ
  for (let i = 0; i < donuts.length - 1; i++) {
    if (random() > 0.3) {
      // 30%の確率でスキップ
      let d1 = donuts[i];
      let d2 = donuts[i + 1];
      let yarnColor = color(random(360), 70, 80);
      yarns.push(
        new Yarn(
          d1.x,
          d1.y,
          d2.x,
          d2.y,
          yarnColor,
          random(5, 12),
          random(0.5, 1.5)
        )
      );
    }
  }
}

function draw() {
  background(20);

  // 毛糸を先に描画（2D描画）
  push();
  // WEBGL座標系のまま描画
  noFill();
  for (let yarn of yarns) {
    stroke(yarn.color);
    strokeWeight(yarn.thickness);

    beginShape();
    for (let i = 0; i < yarn.points.length; i++) {
      let p = yarn.points[i];
      // もふもふ感をランダムに追加
      let offsetX = randomGaussian(0, yarn.fuzziness);
      let offsetY = randomGaussian(0, yarn.fuzziness);
      vertex(p.x + offsetX, p.y + offsetY, -100); // Z座標を後ろに配置
    }
    endShape();
  }
  pop();

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

// 毛糸クラス
class Yarn {
  constructor(
    startX,
    startY,
    targetX,
    targetY,
    colorHex,
    thickness,
    fuzziness
  ) {
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = colorHex;
    this.thickness = thickness;
    this.fuzziness = fuzziness;
    this.points = [];

    this.generatePoints();
  }

  // 毛糸の曲線ポイントを生成
  generatePoints() {
    const segments = 100;
    const controlPoints = [];

    // 制御点をランダムに生成
    const numControlPoints = 5;
    for (let i = 0; i < numControlPoints; i++) {
      const t = (i + 1) / (numControlPoints + 1);
      let x = lerp(this.startX, this.targetX, t) + randomGaussian(0, 50);
      let y = lerp(this.startY, this.targetY, t) + randomGaussian(0, 50);
      controlPoints.push({ x: x, y: y });
    }

    // 曲線ポイントを生成
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let x = lerp(this.startX, this.targetX, t);
      let y = lerp(this.startY, this.targetY, t);

      // 制御点の影響を加える
      for (let j = 0; j < controlPoints.length; j++) {
        const influence = sin((j + 1) * t * PI) * 0.3;
        x += (controlPoints[j].x - x) * influence;
        y += (controlPoints[j].y - y) * influence;
      }

      this.points.push({ x: x, y: y });
    }
  }

  // 毛糸を描画
  display() {
    stroke(this.color);
    strokeWeight(this.thickness);
    noFill();

    beginShape();
    for (let p of this.points) {
      // もふもふ感をランダムに追加
      const offsetX = randomGaussian(0, this.fuzziness);
      const offsetY = randomGaussian(0, this.fuzziness);
      vertex(p.x + offsetX, p.y + offsetY);
    }
    endShape();
  }
}

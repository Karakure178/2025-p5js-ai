// グリッド上の円の中にカラフルな三角形を充填

let gridNum = 30; // グリッドの数
let numTrianglesPerCircle = 30; // 各円に配置する三角形の数
let minDistance = 2; // 三角形間の最小距離

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent("canvas-container");
  colorMode(HSB, 360, 100, 100, 100);
  noLoop();
}

function draw() {
  background(20);

  // グリッド上に円と三角形を描画
  grid(gridNum);
}

// 各円の中に三角形を充填する関数
function fillCircleWithTriangles(centerX, centerY, radius) {
  let triangles = [];

  for (let i = 0; i < numTrianglesPerCircle; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      // 円の中心からランダムな距離と角度
      let angle = random(TWO_PI);
      let distance = random(radius * 0.85);
      let x = centerX + cos(angle) * distance;
      let y = centerY + sin(angle) * distance;

      // 三角形のサイズと回転
      let size = random(8, 20);
      let rotation = random(TWO_PI);

      // 色相をランダムに
      let hue = random(360);
      let saturation = random(60, 100);
      let brightness = random(70, 100);

      // 三角形の頂点を計算
      let vertices = [];
      for (let j = 0; j < 3; j++) {
        let vertexAngle = rotation + (TWO_PI / 3) * j;
        let vx = x + cos(vertexAngle) * size;
        let vy = y + sin(vertexAngle) * size;
        vertices.push({ x: vx, y: vy });
      }

      // すべての頂点が円の中にあるかチェック
      let allInsideCircle = true;
      for (let vertex of vertices) {
        let distFromCenter = dist(vertex.x, vertex.y, centerX, centerY);
        if (distFromCenter > radius) {
          allInsideCircle = false;
          break;
        }
      }

      // 他の三角形と重なっていないかチェック
      let overlapping = false;
      if (allInsideCircle) {
        for (let other of triangles) {
          let d = dist(x, y, other.x, other.y);
          let minDist = size + other.size + minDistance;
          if (d < minDist) {
            overlapping = true;
            break;
          }
        }
      }

      if (allInsideCircle && !overlapping) {
        triangles.push({
          x: x,
          y: y,
          size: size,
          rotation: rotation,
          hue: hue,
          saturation: saturation,
          brightness: brightness,
          vertices: vertices,
        });
        placed = true;
      }

      attempts++;
    }
  }

  // 三角形を描画
  for (let tri of triangles) {
    // 塗りつぶし
    fill(tri.hue, tri.saturation, tri.brightness, 80);
    noStroke();

    triangle(
      tri.vertices[0].x,
      tri.vertices[0].y,
      tri.vertices[1].x,
      tri.vertices[1].y,
      tri.vertices[2].x,
      tri.vertices[2].y
    );

    // エッジを描画
    stroke(tri.hue, tri.saturation, tri.brightness - 20, 100);
    strokeWeight(1);
    noFill();

    triangle(
      tri.vertices[0].x,
      tri.vertices[0].y,
      tri.vertices[1].x,
      tri.vertices[1].y,
      tri.vertices[2].x,
      tri.vertices[2].y
    );
  }
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("triangle-circle-grid", "png");
  }
  if (key === "r") {
    redraw();
  }
}

const grid = (num) => {
  const n1 = num + 1;

  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;

  const nw = width / n1;
  const nh = height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);

      // 円の中心と半径を計算
      const centerX = x + nw / 2;
      const centerY = y + nh / 2;
      const radius = nw / 2;

      // 円の枠を描画
      noFill();
      stroke(255, 50);
      strokeWeight(1.5);
      //   circle(centerX, centerY, radius * 2);

      // 円の中に三角形を充填
      fillCircleWithTriangles(centerX, centerY, radius);
    }
  }
};

// 立方体を球の表面上で回転させるアニメーション

let sphereRadius = 200; // 球の半径
let cubeSize = 40; // 立方体のサイズ
let angle = 0; // 回転角度

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
}

function draw() {
  background(20);

  // ライティング設定
  ambientLight(60);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  pointLight(150, 150, 255, 200, -200, 200);

  // カメラを回転
  rotateY(frameCount * 0.005);
  rotateX(frameCount * 0.003);

  // 半透明の球を描画
  //   push();
  //   noFill();
  //   stroke(100, 100, 150, 100);
  //   strokeWeight(1);
  //   sphere(sphereRadius);
  //   pop();

  // 球の表面上の位置を計算
  angle += 0.02;
  let theta = angle; // 経度
  let phi = sin(angle * 0.7) * PI * 0.5 + PI * 0.5; // 緯度を波形で変化

  // 球面座標から直交座標に変換
  let x = sphereRadius * sin(phi) * cos(theta);
  let y = sphereRadius * cos(phi);
  let z = sphereRadius * sin(phi) * sin(theta);

  // 立方体を球の表面に配置
  push();
  translate(x, y, z);

  // 立方体を球の中心方向に向ける
  let dir = createVector(x, y, z);
  dir.normalize();

  // 回転を適用
  rotateZ(atan2(dir.y, dir.x));
  rotateY(atan2(dir.x, dir.z));

  // 立方体自体も回転
  rotateX(frameCount * 0.02);
  rotateY(frameCount * 0.03);

  // 立方体を描画
  fill(255, 100, 150);
  noStroke();
  box(cubeSize);
  pop();

  // 軌跡を示す点を描画（オプション）
  push();
  translate(x, y, z);
  fill(255, 200, 100, 150);
  sphere(5);
  pop();
}

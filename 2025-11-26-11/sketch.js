// 立方体を球の表面上で回転させるアニメーション

let sphereRadius = 200; // 球の半径
let cubes = []; // 立方体の配列
let numCubes = 20; // 立方体の数

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");

  // 複数の立方体を初期化
  for (let i = 0; i < numCubes; i++) {
    cubes.push({
      size: random(20, 60), // ランダムなサイズ
      angleOffset: random(TWO_PI), // 初期角度のオフセット
      speed: random(0.01, 0.03), // 回転速度
      phiOffset: random(TWO_PI), // 緯度のオフセット
      phiSpeed: random(0.5, 1.2), // 緯度変化の速度
      color: color(random(100, 255), random(100, 255), random(100, 255)), // ランダムな色
      rotSpeed: createVector(
        random(-0.03, 0.03),
        random(-0.03, 0.03),
        random(-0.03, 0.03)
      ), // 自転速度
    });
  }
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

  // 各立方体を描画
  for (let cube of cubes) {
    // 球の表面上の位置を計算
    let angle = frameCount * cube.speed + cube.angleOffset;
    let theta = angle; // 経度
    let phi = sin(angle * cube.phiSpeed + cube.phiOffset) * PI * 0.5 + PI * 0.5; // 緯度を波形で変化

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
    rotateX(frameCount * cube.rotSpeed.x);
    rotateY(frameCount * cube.rotSpeed.y);
    rotateZ(frameCount * cube.rotSpeed.z);

    // 立方体を描画
    fill(cube.color);
    noStroke();
    box(cube.size);
    pop();
  }
}

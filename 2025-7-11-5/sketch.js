let angle = 0;
let radius = 200;
let colorShift = 0;
let pulseScale = 1;
let colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F0FF33",
  "#FF33F0",
  "#33FFF0",
  "#F033FF",
];
let num = 20; // 球体の数
let colorsNum = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < num; i++) {
    colorsNum.push(random(colors));
  }
}

function draw() {
  background(20, 30, 40); // 固定の背景色に変更
  orbitControl(); // Allows camera control with the mouse

  push();

  // 全体の回転
  // rotateX(angle * 0.008);
  // rotateY(angle * 0.012);
  // rotateZ(angle * 0.005);

  // パルス効果
  pulseScale = 1 + sin(angle * 0.1) * 0.3;
  //scale(pulseScale);

  shininess(80);
  noStroke();

  // drawSphere(num, colorsNum);
  grid(4, num, colorsNum);

  // 中央にメインの発光体を追加
  // push();
  // fill(255, 255, 100, 200);
  // emissiveMaterial(255, 255, 0);
  // rotateX(angle * 0.02);
  // rotateY(angle * 0.03);
  // let centerSize = 30 + sin(angle * 0.2) * 10;
  // sphere(centerSize);
  // pop();

  // // 追加のリング効果
  // for (let ring = 0; ring < 3; ring++) {
  //   push();
  //   rotateX(angle * 0.01 * (ring + 1));
  //   rotateZ(angle * 0.015 * (ring + 1));
  //   noFill();
  //   stroke(255, 100 + ring * 50, 255 - ring * 80, 100);
  //   strokeWeight(2);
  //   ellipse(0, 0, (ring + 1) * 150);
  //   pop();
  // }

  pop();

  // Increment the angle for the next frame
  angle += 1.2; // アニメーション速度を上げる
  colorShift += 0.08; // 色変化の速度
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawRect(x, y, z) {
  push();
  translate(x, y, z);
  box(50);
  pop();
}

function drawSphere(num, colors) {
  for (let i = 0; i < num; i++) {
    let a = 360 / num;

    // より複雑な軌道
    let radiusVariation = radius + sin(angle * 0.05 + i) * 50;
    let x = radiusVariation * cos(radians(angle + i * a));
    let y =
      radiusVariation * cos(radians(0 * 0.7)) + sin(radians(0 + i * a)) * 80;
    let z = radiusVariation * sin(radians(angle + i * a));

    push();
    translate(x, y, z);

    fill(colors[i]);

    // 球体のサイズも動的に変化
    let sphereSize = 15 + sin(angle * 0.15 + i) * 8;

    // 個別の回転
    //rotateX(angle * 0.02 + i);
    //rotateY(angle * 0.03 + i);

    sphere(sphereSize);
    pop();
  }
}

/** num個で分割したグリッドを画面いっぱいに生成する
 * @method grid
 * @param  {Number}        num           画面の分割数
 */
const grid = (num, sphereNum, colors) => {
  const n1 = num + 1;

  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;

  const nw = width / n1;
  const nh = height / n1;
  const particles = [];

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      push();
      translate(-width / 2 + x, -height / 2 + y);
      drawSphere(sphereNum, colors);
      pop();
    }
  }
  return particles;
};

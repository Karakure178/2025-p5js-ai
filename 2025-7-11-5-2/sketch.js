let angle = 0;
let radius = 200;
let colorShift = 0;
let pulseScale = 1;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  // 動的な背景色
  // let bgR = 20 + sin(angle * 0.02) * 15;
  // let bgG = 30 + cos(angle * 0.03) * 20;
  // let bgB = 40 + sin(angle * 0.025) * 25;
  // background(bgR, bgG, bgB);
  background(20, 30, 40); // 固定の背景色に変更
  orbitControl(); // Allows camera control with the mouse

  push();
  
  // 全体の回転
  rotateX(angle * 0.008);
  rotateY(angle * 0.012);
  rotateZ(angle * 0.005);
  
  // パルス効果
  pulseScale = 1 + sin(angle * 0.1) * 0.3;
  scale(pulseScale);
  
  shininess(80);
  noStroke();
  
  let num = 15; // 球体の数を増やす
  for (let i = 0; i < num; i++) {
    let a = 360/num;
    
    // より複雑な軌道
    let radiusVariation = radius + sin(angle * 0.05 + i) * 50;
    let x = radiusVariation * cos(radians(angle + i * a));
    let y = radiusVariation * cos(radians(angle * 0.7)) + sin(radians(angle + i * a)) * 80;
    let z = radiusVariation * sin(radians(angle + i * a));
    
    push();
    translate(x, y, z);
    
    // 動的な色変化
    let r = 255 * (sin(colorShift + i * 0.5) * 0.5 + 0.5);
    let g = 255 * (cos(colorShift + i * 0.8) * 0.5 + 0.5);
    let b = 255 * (sin(colorShift + i * 1.2) * 0.5 + 0.5);
    fill(r, g, b);
    
    // 球体のサイズも動的に変化
    let sphereSize = 15 + sin(angle * 0.15 + i) * 8;
    
    // 個別の回転
    rotateX(angle * 0.02 + i);
    rotateY(angle * 0.03 + i);
    
    sphere(sphereSize);
    pop();
  }
  
  // 中央にメインの発光体を追加
  push();
  fill(255, 255, 100, 200);
  emissiveMaterial(255, 255, 0);
  rotateX(angle * 0.02);
  rotateY(angle * 0.03);
  let centerSize = 30 + sin(angle * 0.2) * 10;
  sphere(centerSize);
  pop();
  
  // 追加のリング効果
  for (let ring = 0; ring < 3; ring++) {
    push();
    rotateX(angle * 0.01 * (ring + 1));
    rotateZ(angle * 0.015 * (ring + 1));
    noFill();
    stroke(255, 100 + ring * 50, 255 - ring * 80, 100);
    strokeWeight(2);
    ellipse(0, 0, (ring + 1) * 150);
    pop();
  }
  // let x = radius * cos(angle);
  // let z = radius * sin(angle);
  // rotateX(angle * 1.5);
  // rotateY(angle * 1.5);
  // drawRect(x,0,z);

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

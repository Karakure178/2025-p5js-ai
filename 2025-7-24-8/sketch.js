// 回転する花びらのようなパターンアニメーション
let angle = 0;
let radius = 100;
let numPetals = 8;
let colorOffset = 0;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
}

function draw() {
  // 背景をゆっくりとフェード
  background(0);
  grid(3);

  // アニメーション変数を更新
  angle += 0.02;
  colorOffset += 0.5;
  radius = 100 + sin(angle * 2) * 30;
  filter(BLUR, 6);
  filter(POSTERIZE, 1 / (1 / 6.5));
}

function drawFlowerPattern() {
  push();

  for (let i = 0; i < numPetals; i++) {
    push();
    rotate((TWO_PI / numPetals) * i + angle);

    // 花びらの色を時間で変化
    let hue = (i * 45 + colorOffset) % 360;
    fill(hue, 80, 90, 70);
    noStroke();

    // 花びらの形を描画
    beginShape();
    for (let j = 0; j <= 20; j++) {
      let t = map(j, 0, 20, 0, PI);
      let r = radius * sin(t) * (1 + 0.3 * sin(angle * 3 + i));
      let x = r * cos(t);
      let y = r * sin(t);
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  pop();
}

const grid = (num, colors) => {
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
      translate(x + nw / 2, y + nh / 2);
      drawFlowerPattern();
      pop();
    }
  }
  return particles;
};

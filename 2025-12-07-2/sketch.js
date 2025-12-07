const CANVAS_SIZE = 600;
const BG_COLOR = "#f8f2ec";

let outerState = { angle: 0 };
let innerState = { angle: 0 };

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  angleMode(RADIANS);
  frameRate(60);
  initGsapRotation();
}

function draw() {
  background(BG_COLOR);

  // 中央に配置
  translate(width / 2, height / 2);

  // 影で奥行きを演出
  drawShadow(0, 10, 420, color(0, 0, 0, 25));

  // 外側リング（左右で色分け）
  drawSplitRing({
    outerRadius: 210,
    innerRadius: 140,
    leftColor: "#7a638c",
    rightColor: "#f6c1c7",
    angle: outerState.angle,
  });

  // 内側リング（左右で別配色）
  drawSplitRing({
    outerRadius: 120,
    innerRadius: 70,
    leftColor: "#8eb9b3",
    rightColor: "#fdebd7",
    angle: innerState.angle,
  });

  // 中心に小さな円を添えてバランス調整
  noStroke();
  fill("#ffffff");
  circle(0, 0, 28);
  fill("#dba7a1");
  circle(-6, 0, 12);
  fill("#96c1b8");
  circle(8, -4, 10);
}

// 半分ずつ色の違うリングを描く
function drawSplitRing({
  outerRadius,
  innerRadius,
  leftColor,
  rightColor,
  angle = 0,
}) {
  noStroke();
  push();
  rotate(angle);

  // 右半分
  fill(rightColor);
  arc(0, 0, outerRadius * 2, outerRadius * 2, -HALF_PI, HALF_PI, PIE);

  // 左半分
  fill(leftColor);
  arc(0, 0, outerRadius * 2, outerRadius * 2, HALF_PI, -HALF_PI, PIE);

  // 内側を背景色でくり抜きドーナツ状にする
  fill(BG_COLOR);
  circle(0, 0, innerRadius * 2);

  pop();
}

// 柔らかい影を描く
function drawShadow(x, y, diameter, col) {
  push();
  translate(x, y);
  noStroke();
  fill(col);
  ellipse(0, 0, diameter, diameter * 0.35);
  pop();
}

// GSAPで2つのリングを独立回転させる
function initGsapRotation() {
  if (typeof gsap === "undefined") return;

  const wrapAngle = (value) => ((value % TWO_PI) + TWO_PI) % TWO_PI;

  gsap.set(outerState, { angle: 0 });
  gsap.set(innerState, { angle: 0 });

  gsap.to(outerState, {
    angle: TWO_PI,
    duration: 4,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
    modifiers: {
      angle: wrapAngle,
    },
  });

  gsap.to(innerState, {
    angle: -TWO_PI,
    duration: 2.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    modifiers: {
      angle: wrapAngle,
    },
  });
}

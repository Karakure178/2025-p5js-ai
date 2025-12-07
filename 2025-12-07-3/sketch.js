const CANVAS_SIZE = 600;
const BG_COLOR = "#EAEAEA";
const GRID_COUNT = 4;

let rings = [];

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  angleMode(RADIANS);
  frameRate(60);
  rings = buildRingGrid(GRID_COUNT);
  initGsapRotation();
}

function draw() {
  background(BG_COLOR);

  rings.forEach((ring) => {
    push();
    translate(ring.x, ring.y);

    drawSplitRing({
      outerRadius: ring.outerRadius,
      innerRadius: ring.innerRadius,
      leftColor: ring.leftColor,
      rightColor: ring.rightColor,
      angle: ring.state.angle,
    });

    // 小さな点でアクセント
    noStroke();
    fill(255);
    circle(0, 0, ring.innerRadius * 0.4);
    fill(ring.leftColor);
    circle(-ring.innerRadius * 0.2, 0, ring.innerRadius * 0.18);
    fill(ring.rightColor);
    circle(
      ring.innerRadius * 0.25,
      -ring.innerRadius * 0.15,
      ring.innerRadius * 0.15
    );
    pop();
  });
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

// GSAPでリングを独立回転させる
function initGsapRotation() {
  if (typeof gsap === "undefined") return;

  const wrapAngle = (value) => ((value % TWO_PI) + TWO_PI) % TWO_PI;

  rings.forEach((ring, idx) => {
    gsap.set(ring.state, { angle: ring.state.angle });
    gsap.to(ring.state, {
      angle: ring.direction * TWO_PI,
      duration: ring.duration,
      ease: ring.ease,
      repeat: -1,
      yoyo: true,
      modifiers: {
        angle: wrapAngle,
      },
    });
  });
}

// グリッドに合わせてリング情報を構築
function buildRingGrid(num) {
  const positions = [];
  const collector = {
    circle: (x, y, d) => positions.push({ x, y, d }),
  };
  grid(num, collector);

  const palette = [
    "#08D9D6",
    "#252A34",
    "#FF2E63",
    "#E84545",
    "#903749",
    "#53354A",
  ];

  return positions.map((pos, idx) => {
    let leftColor = random(palette);
    let rightColor = random(palette);
    while (rightColor === leftColor) rightColor = random(palette);

    const outerRadius = pos.d * 0.45;
    const innerRadius = pos.d * 0.25;
    const baseAngle = random(TWO_PI);

    return {
      x: pos.x,
      y: pos.y,
      outerRadius,
      innerRadius,
      leftColor,
      rightColor,
      state: { angle: baseAngle },
      duration: random(2.2, 4.5),
      direction: idx % 2 === 0 ? 1 : -1,
      ease: idx % 3 === 0 ? "power2.inOut" : "sine.inOut",
    };
  });
}

// 提供されたグリッド関数（座標算出に利用）
const grid = (num, pg) => {
  const n1 = num + 1;
  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;
  const nw = width / n1;
  const nh = height / n1;
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pg.circle(x + nw / 2, y + nw / 2, nw);
    }
  }
};

keyPressed = () => {
  if (key === "s") {
    //saveCanvas(canvas, "canvas", "png");
    saveGif("canvas", 2);
  }
};

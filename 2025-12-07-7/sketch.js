const CANVAS_W = 480;
const CANVAS_H = 480;
const SLASH_COUNT = 10;

let slashBursts = [];
let shimmerDots = [];
let fadeOverlay = { alpha: 0 };
let ringBurst = { radius: 0, alpha: 0 };
let fadeTimeline;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
  angleMode(RADIANS);
  noFill();
  createShimmerDots();
  initFadeAnimation();
}

function draw() {
  drawGalaxyBackground();
  drawShimmerDots();
  updateSlashBursts();
  drawSlashBursts();
  drawRingBurst();
  drawFadeOverlay();
}

// 星屑の位置を作成
function createShimmerDots() {
  shimmerDots = [];
  for (let i = 0; i < 120; i++) {
    shimmerDots.push({
      x: random(width),
      y: random(height),
      r: random(1, 3),
      phase: random(TWO_PI),
    });
  }
}

// 放射状の背景
function drawGalaxyBackground() {
  push();
  noStroke();
  for (let i = 0; i < 6; i++) {
    const alpha = map(i, 0, 5, 200, 30);
    fill(20, 5, 40, alpha);
    rect(0, 0, width, height);
  }
  pop();
}

// きらめく粒子
function drawShimmerDots() {
  push();
  noStroke();
  for (const dot of shimmerDots) {
    const twinkle = map(sin(frameCount * 0.05 + dot.phase), -1, 1, 0.2, 1);
    fill(255, 210, 255, 200 * twinkle);
    ellipse(dot.x, dot.y, dot.r * twinkle * 2, dot.r * twinkle * 2);
  }
  pop();
}

// GSAPでフェードと「しゅぱ」演出
function initFadeAnimation() {
  if (typeof gsap === "undefined") {
    return;
  }
  fadeTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
  fadeTimeline.to(fadeOverlay, {
    alpha: 1,
    duration: 0.35,
    ease: "power4.out",
    onStart: triggerBurst,
  });
  fadeTimeline.to(fadeOverlay, {
    alpha: 0,
    duration: 0.8,
    ease: "expo.inOut",
  });
}

// フラッシュ開始
function triggerBurst() {
  spawnSlashBursts();
  ringBurst.radius = 40;
  ringBurst.alpha = 0.9;
  if (typeof gsap !== "undefined") {
    gsap.to(ringBurst, {
      radius: width * 0.9,
      alpha: 0,
      duration: 0.6,
      ease: "expo.out",
    });
  }
}

// しゅぱっとした斜線を作成
function spawnSlashBursts() {
  slashBursts = [];
  for (let i = 0; i < SLASH_COUNT; i++) {
    slashBursts.push({
      x: random(width),
      y: random(height),
      len: random(40, 90),
      angle: random(-PI / 3, PI / 3),
      alpha: 255,
      speed: random(7, 14),
    });
  }
}

// 斜線の寿命管理
function updateSlashBursts() {
  for (const slash of slashBursts) {
    slash.x += cos(slash.angle) * slash.speed;
    slash.y += sin(slash.angle) * slash.speed;
    slash.alpha -= 18;
  }
  slashBursts = slashBursts.filter((slash) => slash.alpha > 5);
}

// 斜線描画
function drawSlashBursts() {
  if (!slashBursts.length) {
    return;
  }
  push();
  strokeCap(ROUND);
  strokeWeight(4);
  for (const slash of slashBursts) {
    const dx = cos(slash.angle) * slash.len;
    const dy = sin(slash.angle) * slash.len;
    stroke(255, 230, 255, slash.alpha);
    line(
      slash.x - dx * 0.5,
      slash.y - dy * 0.5,
      slash.x + dx * 0.5,
      slash.y + dy * 0.5
    );
  }
  pop();
}

// 中央から広がるリング
function drawRingBurst() {
  if (ringBurst.alpha <= 0.01) {
    return;
  }
  push();
  stroke(255, 200, 255, ringBurst.alpha * 255);
  strokeWeight(2);
  ellipse(width / 2, height / 2, ringBurst.radius, ringBurst.radius);
  pop();
}

// フェードマスク
function drawFadeOverlay() {
  if (fadeOverlay.alpha <= 0.01) {
    return;
  }
  push();
  noStroke();
  fill(10, 0, 30, fadeOverlay.alpha * 220);
  rect(0, 0, width, height);
  pop();
}

function keyPressed() {
  if (key === "s") {
    // saveCanvas("shupa", "png");
    saveGif("canvas", 2);
  }
}

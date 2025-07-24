const colors = [
  "#FF5733", // Red
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FFFF33", // Yellow
  "#FF33FF", // Magenta
  "#33FFFF", // Cyan
  "#FF8C00", // Dark Orange
  "#8A2BE2", // Blue Violet
  "#FF1493", // Deep Pink
  "#00CED1", // Dark Turquoise
];
const colors_1 = [];
const num = 10;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  background(0);
  for (let i = 0; i < num; i++) {
    colors_1.push(random(colors));
  }
  //console.log(colors_1);
}

function draw() {
  translate(-width / 2, -height / 2, -50);
  background(0);
  let gridSize = 70;
  noStroke();
  for (let x = gridSize / 2; x < width; x += gridSize) {
    for (let y = gridSize / 2; y < height; y += gridSize) {
      let d = dist(x, y, width / 2, height / 2);
      let size = (d / 10) * sin(frameCount * 0.05) + gridSize / 2;
      fill(255, 200, 200);
      ellipse(x, y, size, size);
    }
  }

  // 立方体を描く
  push();
  translate(width / 2, height / 2, 50);
  rotateX(frameCount * 0.01);
  fill(255);
  //box(100);
  pop();

  push();
  translate(width / 2, height / 2, 50);
  rotateZ(frameCount * 0.01);
  draw3DShapes(num, 50, 200, colors_1);
  draw3DShapes(num, 25, 150, colors_1);
  draw3DShapes(num, 10, 100, colors_1);
  pop();

  //filter(BLUR, 6);
  //filter(POSTERIZE, 1 / (1 / 6.5));
}

// 立体が円上に１０こ配置する関数
function draw3DShapes(numShapes, s, radius) {
  for (let i = 0; i < numShapes; i++) {
    let angle = map(i, 0, numShapes, 0, TWO_PI);
    let x = radius * cos(angle);
    let y = radius * sin(angle);
    push();
    translate(x, y, 50);
    rotateX(frameCount * 0.01 + angle);
    fill(colors_1[i]);
    box(s);
    pop();
  }
}

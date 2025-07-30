const colors = [];
const colorSelect = ["#B9375D", "#D25D5D", "#E7D3D3"];
let numShapes = 10;

function setup() {
  createCanvas(800, 800, WEBGL);
  rectMode(CENTER);
  noStroke();
  fill(0);
  for (let i = 0; i < numShapes; i++) {
    colors.push([]);
    for (let j = 0; j < numShapes; j++) {
      colors[i].push(random(colorSelect));
    }
  }
}

function draw() {
  background("#EEEEEE");
  translate(-width / 2, -height / 2);

  let spacing = min(width, height) / numShapes;

  for (let i = 0; i < numShapes; i++) {
    for (let j = 0; j < numShapes; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      let d = dist(width / 2, height / 2, x, y);
      let size = map(
        sin(d * 0.05 + frameCount * 0.05),
        -1,
        1,
        spacing * 0.2,
        spacing * 1.2
      );

      push();
      translate(x, y);
      rotateX(frameCount * 0.01);
      rotateY(frameCount * 0.01);
      fill(colors[i][j]);
      rect(0, 0, size, size);
      pop();
    }
  }
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

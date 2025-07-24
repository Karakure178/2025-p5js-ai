function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0);
}

function draw() {
  background(0, 50);
  let gridSize = 70;

  for (let x = gridSize / 2; x < width; x += gridSize) {
    for (let y = gridSize / 2; y < height; y += gridSize) {
      let d = dist(x, y, width / 2, height / 2);
      let size = (d / 10) * sin(frameCount * 0.05) + gridSize / 2;
      fill(255, 200, 200);
      ellipse(x, y, size, size);
    }
  }
  //filter(BLUR, 6);
  //filter(POSTERIZE, 1 / (1 / 6.5));
}

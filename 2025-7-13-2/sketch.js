function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  background(0, 0, 95);

  let numShapes = 20;
  let spacing = min(width, height) / numShapes;

  for (let i = 0; i < numShapes; i++) {
    for (let j = 0; j < numShapes; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;
      
      let d = dist(mouseX, mouseY, x, y);
      let size = map(sin(d * 0.05 + frameCount * 0.05), -1, 1, spacing * 0.2, spacing * 1.2);
      
      let h = map(atan2(mouseY - y, mouseX - x), -PI, PI, 0, 360);
      
      fill(h, 80, 90);
      ellipse(x, y, size, size);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

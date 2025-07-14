let cols, rows;
const scl = 25;
let zoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  cols = floor(width / scl);
  rows = floor(height / scl);
}

function draw() {
  background(0);

  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let noiseVal = noise(xoff, yoff, zoff);

      let hue = map(noiseVal, 0, 1, 0, 360);
      let saturation = 90;
      let brightness = map(sin(noiseVal * PI * 2 + frameCount * 0.05), -1, 1, 40, 100);
      let alpha = map(cos(noiseVal * PI * 2 + frameCount * 0.05), -1, 1, 50, 100);

      // fill(hue, saturation, brightness, alpha);

      let rectX = x * scl;
      let rectY = y * scl;
      let size = map(noiseVal, 0, 1, scl * 0.05, scl * 2.5);

      push();
      translate(rectX + scl / 2, rectY + scl / 2);
      rotate(noiseVal * TWO_PI);
      rectMode(CENTER);
      rect(0, 0, size, size);
      pop();

      xoff += 0.1;
    }
    yoff += 0.1;
  }
  zoff += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
}

let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  stroke(255, 255, 255, 50);
  noFill();
}

function draw() {
  background(0, 5);
  translate(width / 2, height / 2);

  for (let i = 0; i < 10; i++) {
    beginShape();
    for (let j = 0; j < 360; j += 2) {
      let rad = map(j, 0, 360, 0, TWO_PI);
      let r = map(noise(cos(rad) + i * 10 + t, sin(rad) + i * 10 + t), 0, 1, 100, 200);
      let x = r * cos(rad);
      let y = r * sin(rad);
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  t += 0.005;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let squares = [];
let colors = ["#78B9B5e0", "#0F828Ce0", "#065084e0", "#320A6Be0"];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();

  for (let i = 0; i < 500; i++) {
    squares.push({
      x: random(width),
      y: random(height),
      size: map(sin(radians(i)), -1, 1, 5, 10),
      angle: random(TWO_PI),
      color: random(colors),
    });
  }
}

function draw() {
  background(20);
  for (let i = 0; i < squares.length; i++) {
    let s = squares[i];

    let x =
      100 * cos(radians(frameCount)) + cos(radians(frameCount)) + width / 2;
    let y =
      100 * sin(radians(frameCount)) + cos(radians(frameCount)) + height / 2;

    let distance = dist(x, y, s.x, s.y);

    let newSize = map(distance, 0, 200, 100, s.size);
    let newAngle = map(distance, 0, 200, TWO_PI, s.angle);

    push();
    translate(s.x, s.y);
    // rotate(newAngle);
    fill(s.color);
    rect(0, 0, newSize, newSize);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let angle = 0;
let radius = 200;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(10, 20, 30);
  orbitControl(); // Allows camera control with the mouse

  push();
  shininess(50);
  fill(255, 100, 150);
  noStroke();
  let num = 10;
  for (let i = 0; i < num; i++) {
    let a = 360/num;
    let x = radius * cos(radians(angle+i*a));
    let y = radius * cos(radians(angle)) + sin(radians(angle+i*a));
    let z = radius * sin(radians(angle+i*a));
    push();
    translate(x, y, z);
    sphere(10);
    pop();
  }
  // let x = radius * cos(angle);
  // let z = radius * sin(angle);
  // rotateX(angle * 1.5);
  // rotateY(angle * 1.5);
  // drawRect(x,0,z);

  pop();

  // Increment the angle for the next frame
  angle += 0.5;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawRect(x, y, z) {
  push();
  translate(x, y, z);
  box(50);
  pop();
}

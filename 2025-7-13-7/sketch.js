function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noFill();
  strokeWeight(1.5);
}

function draw() {
  background(0);
  orbitControl(2, 2, 0.1); // Allows mouse control for 3D navigation

  let time = frameCount * 0.01;

  // Ring 1
  push();
  stroke(255, 100, 255); // Neon Pink
  rotateX(time * 1.2);
  rotateY(time * 1.3);
  torus(200, 30, 24, 16);
  pop();

  // Ring 2
  push();
  stroke(100, 255, 255); // Neon Cyan
  rotateX(time * -1.1);
  rotateY(time * -1.4);
  rotateZ(time * 0.8);
  torus(120, 20, 24, 16);
  pop();

  // Ring 3
  push();
  stroke(255, 255, 100); // Neon Yellow
  rotateZ(time * 0.9);
  rotateX(time * 1.5);
  torus(280, 15, 24, 16);
  pop();
  
  // Central Sphere
  push();
  stroke(255);
  sphere(30);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

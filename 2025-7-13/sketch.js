
let particles = [];
const num = 300; // Reduced particle count for a more subtle look
const noiseScale = 0.01;
const speed = 0.2; // Slowed down the particle speed
let zoff = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }
  stroke(255, 40); // Made the lines slightly more transparent
  background(0);
}

function draw() {
  background(0, 10); // Faster fade for a cleaner, more minimal trail
  zoff += 0.001; // Slowed down the noise evolution for calmer changes

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    // Simplified angle calculation for smoother, less chaotic flow
    let angle = noise(p.x * noiseScale, p.y * noiseScale, zoff) * TWO_PI;
    let v = p5.Vector.fromAngle(angle);
    v.mult(speed);
    
    let pOld = p.copy();
    p.add(v);

    if (p.x > width) p.x = 0;
    if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    if (p.y < 0) p.y = height;

    line(pOld.x, pOld.y, p.x, p.y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  particles = [];
   for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }
}

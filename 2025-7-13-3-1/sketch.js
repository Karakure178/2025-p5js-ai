let particles = [];
const numParticles = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0); // Add a slight trail effect

  for (let particle of particles) {
    particle.update();
    particle.display();
    particle.bounce();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.size = random(10, 30);
    this.hue = random(360);
  }

  update() {
    this.pos.add(this.vel);
    this.hue = (this.hue + 0.5) % 360; // Slowly shift the hue
  }

  display() {
    fill(this.hue, 90, 90, 80);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  bounce() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

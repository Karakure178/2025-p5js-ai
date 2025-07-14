let particles = [];
const numParticles = 800; // More particles!

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 0, 0, 25); // Energetic trails

  for (let particle of particles) {
    particle.update();
    particle.display();
    particle.bounce();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(3, 8)); // Faster!
    this.acc = createVector(0, 0);
    this.maxSpeed = 10;
    this.hue = random(360);
  }

  update() {
    // Flee from the mouse
    let mouse = createVector(mouseX, mouseY);
    let force = p5.Vector.sub(this.pos, mouse);
    let distance = force.mag();
    if (distance < 150) {
      let strength = map(distance, 0, 150, 12, 0);
      force.setMag(strength);
      this.acc.add(force);
    }

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0); // Reset acceleration each frame

    this.hue = (this.hue + 3) % 360; // Faster color change
  }

  display() {
    // Size is based on velocity
    let size = map(this.vel.mag(), 0, this.maxSpeed, 2, 20);
    fill(this.hue, 90, 90, 80);
    ellipse(this.pos.x, this.pos.y, size, size);
  }

  bounce() {
    if (this.pos.x < 5 || this.pos.x > width - 5) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 5 || this.pos.y > height - 5) {
      this.vel.y *= -1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reset particles to avoid them getting stuck off-screen
  particles = [];
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

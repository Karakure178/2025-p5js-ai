let particleSystems = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
}

function draw() {
  background(0, 0, 0, 10); // Fading background

  for (let i = particleSystems.length - 1; i >= 0; i--) {
    let ps = particleSystems[i];
    ps.run();
    if (ps.isDead()) {
      particleSystems.splice(i, 1);
    }
  }
}

function mouseDragged() {
  particleSystems.push(new ParticleSystem(createVector(mouseX, mouseY)));
}

function mousePressed() {
  particleSystems.push(new ParticleSystem(createVector(mouseX, mouseY)));
}

class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(this.origin));
    }
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  isDead() {
    return this.particles.length === 0;
  }
}

class Particle {
  constructor(position) {
    this.origin = position.copy();
    this.pos = position.copy();
    this.vel = p5.Vector.random2D().mult(random(2, 10));
    this.acc = createVector(0, 0);
    this.lifespan = 100;
    this.hue = random(360);
  }

  run() {
    this.update();
    this.display();
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.lifespan -= 2.5;
    this.vel.mult(0.96); // Friction
  }

  display() {
    noStroke();
    fill(this.hue, 90, 90, this.lifespan);
    ellipse(this.pos.x, this.pos.y, 12, 12);
  }

  isDead() {
    return this.lifespan < 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}

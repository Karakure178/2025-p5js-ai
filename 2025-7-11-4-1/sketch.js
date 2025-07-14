let movers = [];
let numMovers = 50;
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < numMovers; i++) {
    movers.push(new Mover());
  }
}

function draw() {
  background(0, 25); // Lower alpha for trails
  for (let i = 0; i < movers.length; i++) {
    movers[i].update();
    movers[i].display();
    movers[i].checkEdges();
  }
}

class Mover {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-5, 5), random(-5, 5));
    this.size = random(10, 40);
    this.color = color(
      random(100, 255),
      random(100, 255),
      random(100, 255),
      200
    );
  }
  update() {
    this.position.add(this.velocity);
  }
  display() {
    fill(this.color);
    rect(this.position.x, this.position.y, this.size, this.size);
  }

  checkEdges() {
    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y *= -1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

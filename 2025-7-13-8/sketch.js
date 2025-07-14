let hearts = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function draw() {
  background(300, 10, 100); // Light pink background

  // Add a new heart periodically
  if (frameCount % 10 === 0) {
    hearts.push(new Heart());
  }

  for (let i = hearts.length - 1; i >= 0; i--) {
    let h = hearts[i];
    h.update();
    h.display();
    if (h.isOffScreen()) {
      hearts.splice(i, 1);
    }
  }
}

// Custom heart shape function
function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y + size * 0.3);
  bezierVertex(x, y - size * 0.1, x - size * 0.5, y - size * 0.1, x - size * 0.5, y + size * 0.3);
  bezierVertex(x - size * 0.5, y + size * 0.6, x, y + size * 0.8, x, y + size);
  bezierVertex(x, y + size * 0.8, x + size * 0.5, y + size * 0.6, x + size * 0.5, y + size * 0.3);
  bezierVertex(x + size * 0.5, y - size * 0.1, x, y - size * 0.1, x, y + size * 0.3);
  endShape(CLOSE);
}

class Heart {
  constructor() {
    this.x = random(width);
    this.y = height + 50;
    this.size = random(20, 60);
    this.speedY = random(1, 3);
    this.speedX = random(-0.5, 0.5);
    this.hue = random(330, 360); // Shades of pink and red
    this.alpha = random(50, 90);
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
  }

  display() {
    fill(this.hue, 60, 100, this.alpha);
    drawHeart(this.x, this.y, this.size);
  }

  isOffScreen() {
    return this.y < -this.size * 2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

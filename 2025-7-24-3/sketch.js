let stars = [];
let colors = [
  "#FF6347", // Tomato
  "#4682B4", // Steel Blue
  "#32CD32", // Lime Green
  "#FFD700", // Gold
  "#FF69B4", // Hot Pink
  "#8A2BE2", // Blue Violet
  "#FF4500", // Orange Red
  "#00FA9A", // Medium Spring Green
  "#1E90FF", // Dodger Blue
  "#FF8C00", // Dark Orange
  "#FF1493", // Deep Pink
  "#00CED1", // Dark Turquoise
  "#7FFF00", // Chartreuse
  "#FF00FF", // Magenta
  "#00BFFF", // Deep Sky Blue
  "#FF4500", // Orange Red
];
let colors_1 = [];
let speed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 800; i++) {
    stars[i] = new Star();
    colors_1.push(random(colors));
  }
  noStroke();
}

function draw() {
  speed = map(mouseX, 0, width, 0, 20);
  background(0);
  translate(width / 2, height / 2);
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    fill(colors_1[i % colors_1.length]);
    stars[i].show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
    this.pz = this.z;
  }

  update() {
    this.z = this.z - speed;
    if (this.z < 1) {
      this.z = width;
      this.x = random(-width, width);
      this.y = random(-height, height);
      this.pz = this.z;
    }
  }

  show() {
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);

    let r = map(this.z, 0, width, 16, 0);
    ellipse(sx, sy, r, r);
  }
}

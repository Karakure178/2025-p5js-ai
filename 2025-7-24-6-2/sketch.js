// A palette of 4 modern colors
const palette = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261"];
const tileSize = Math.floor(Math.random() * 100) + 50; // Random tile size between 50 and 150

function preload() {}

function setup() {
  createCanvas(800, 800);
  noLoop(); // Static image
  drawPattern();
}

function drawPattern() {
  // No global background color; each tile defines its own.
  for (let x = 0; x < width / tileSize; x++) {
    for (let y = 0; y < height / tileSize; y++) {
      drawTile(x * tileSize, y * tileSize, tileSize);
    }
  }
}

function drawTile(x, y, size) {
  push();
  translate(x, y);

  // Pick two different random colors from the palette
  let bgColor = random(palette);
  let fgColor;
  do {
    fgColor = random(palette);
  } while (bgColor === fgColor); // Ensure foreground and background colors are different

  // Draw the tile's background
  fill(bgColor);
  noStroke();
  rect(0, 0, size, size);

  // Draw the arcs
  stroke(fgColor);
  strokeWeight(size * 0.1); // Adjust thickness based on tile size
  noFill();

  // Randomly choose one of the two arc patterns
  if (random() > 0.5) {
    arc(0, 0, size, size, 0, HALF_PI);
    arc(size, size, size, size, PI, PI + HALF_PI);
  } else {
    arc(size, 0, size, size, HALF_PI, PI);
    arc(0, size, size, size, PI + HALF_PI, TWO_PI);
  }

  pop();
}

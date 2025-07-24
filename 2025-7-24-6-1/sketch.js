// A palette of 4 modern colors
const palette = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261"];
const tileSize = Math.floor(Math.random() * 100) + 50; // Random tile size between 50 and 150

function preload() {
  brush.preload();
}

function setup() {
  createCanvas(800, 800, WEBGL);
  noLoop(); // Static image
  translate(-width / 2, -height / 2); // Center the grid in the canvas
  drawPattern();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

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
  brush.fill(bgColor);
  brush.noStroke();
  brush.rect(0, 0, size, size);

  brush.reBlend();

  // Draw the arcs
  brush.stroke(fgColor);
  brush.strokeWeight(size * 0.1); // Adjust thickness based on tile size
  brush.noFill();

  brush.reBlend();

  // Randomly choose one of the two arc patterns
  if (random() > 0.5) {
    brush.arc(0, 0, size, size, 0, HALF_PI);
    brush.arc(size, size, size, size, PI, PI + HALF_PI);
  } else {
    brush.arc(size, 0, size, size, HALF_PI, PI);
    brush.arc(0, size, size, size, PI + HALF_PI, TWO_PI);
  }

  pop();
}

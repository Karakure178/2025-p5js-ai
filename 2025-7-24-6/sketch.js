// A palette of 5 modern colors for more variety
const palette = ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"];
const tileSize = 40;

function setup() {
  createCanvas(800, 800);
  noLoop(); // Static image
  strokeCap(SQUARE);

  drawPattern();
}

function drawPattern() {
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
  } while (bgColor === fgColor);

  // Draw the tile's background
  fill(bgColor);
  noStroke();
  rect(0, 0, size, size);

  // Randomly select one of the available patterns
  const patternType = floor(random(4));

  // Set drawing style for the foreground pattern
  stroke(fgColor);
  strokeWeight(size * 0.1);
  noFill();

  switch (patternType) {
    case 0: // Original Truchet arcs
      if (random() > 0.5) {
        arc(0, 0, size, size, 0, HALF_PI);
        arc(size, size, size, size, PI, PI + HALF_PI);
      } else {
        arc(size, 0, size, size, HALF_PI, PI);
        arc(0, size, size, size, PI + HALF_PI, TWO_PI);
      }
      break;

    case 1: // Diagonal line
      if (random() > 0.5) {
        line(0, 0, size, size);
      } else {
        line(size, 0, 0, size);
      }
      break;

    case 2: // Central circle
      fill(fgColor);
      noStroke();
      ellipse(size / 2, size / 2, size * 0.7);
      break;

    case 3: // Half-and-half triangles
      fill(fgColor);
      noStroke();
      if (random() > 0.5) {
        triangle(0, 0, size, 0, 0, size);
      } else {
        triangle(size, 0, size, size, 0, size);
      }
      break;
  }

  pop();
}

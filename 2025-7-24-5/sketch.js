// A vibrant color palette
const palette = [
  "#ff6b6b",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#577590",
  "#277da1",
];
const pgs = [];
let num;
let w;

function setup() {
  createCanvas(800, 800);
  noLoop(); // Generate a single static image
  num = Math.floor(random(3, 10));
  w = width / num;

  for (let i = 0; i < num; i++) {
    pgs.push([]);

    for (let j = 0; j < num; j++) {
      pgs[i].push(createGraphics(w, w));
      pgs[i][j].noStroke();
      const bgColor = random(palette);
      pgs[i][j].background(bgColor);
      drawCell(
        pgs[i][j],
        10,
        10,
        pgs[i][j].width - 20,
        pgs[i][j].height - 20,
        5
      );
    }
  }

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      image(pgs[i][j], i * w, j * w);
    }
  }
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function drawCell(pg, x, y, w, h, depth) {
  if (depth <= 0 || min(w, h) < 20) {
    drawFinalShape(pg, x, y, w, h);
    return;
  }

  // Randomly decide how to split the cell
  const splitRatio = random(0.3, 0.7);

  if (random() > 0.5) {
    // Split vertically
    drawCell(pg, x, y, w * splitRatio, h, depth - 1);
    drawCell(pg, x + w * splitRatio, y, w * (1 - splitRatio), h, depth - 1);
  } else {
    // Split horizontally
    drawCell(pg, x, y, w, h * splitRatio, depth - 1);
    drawCell(pg, x, y + h * splitRatio, w, h * (1 - splitRatio), depth - 1);
  }
}

function drawFinalShape(pg, x, y, w, h) {
  pg.push();
  pg.translate(x + w / 2, y + h / 2);
  // Pick a random color from the palette for the shape
  const shapeColor = random(palette);

  // Randomly decide on fill/stroke
  if (random() > 0.5) {
    pg.fill(shapeColor);
    pg.noStroke();
  } else {
    pg.noFill();
    pg.stroke(shapeColor);
    pg.strokeWeight(random(2, 6));
  }

  // Randomly choose a shape to draw
  const shapeType = floor(random(4));

  switch (shapeType) {
    case 0: // Circle
      pg.ellipse(0, 0, min(w, h) * 0.8);
      break;
    case 1: // Rectangle
      pg.rectMode(CENTER);
      pg.rotate(random(-PI / 4, PI / 4));
      pg.rect(0, 0, w * 0.8, h * 0.8, random(10)); // Rounded corners
      break;
    case 2: // Arc
      const startAngle = random(TWO_PI);
      const endAngle = startAngle + random(PI * 0.5, PI * 1.5);
      const diameter = min(w, h) * 0.8;
      pg.arc(0, 0, diameter, diameter, startAngle, endAngle);
      break;
    case 3: // Cross (two lines)
      const margin = min(w, h) * 0.1;
      pg.line(-w / 2 + margin, 0, w / 2 - margin, 0);
      pg.line(0, -h / 2 + margin, 0, h / 2 - margin);
      break;
  }

  pg.pop();
}

// A vibrant color palette
const palette = ['#ff6b6b', '#f9c74f', '#90be6d', '#43aa8b', '#577590', '#277da1'];

function setup() {
  createCanvas(800, 800);
  noLoop(); // Generate a single static image
  
  // Pick a random background color from the palette
  const bgColor = random(palette);
  background(bgColor);
  
  // Draw a border
  stroke(0, 20); // Use a slightly transparent black for the border
  strokeWeight(20);
  noFill();
  rect(0, 0, width, height);

  // Start the recursive drawing process
  drawCell(10, 10, width - 20, height - 20, 5);
}

function drawCell(x, y, w, h, depth) {
  if (depth <= 0 || min(w, h) < 20) {
    // Base case for recursion: draw a final shape if the cell is small or depth is reached
    drawFinalShape(x, y, w, h);
    return;
  }

  // Randomly decide how to split the cell
  const splitRatio = random(0.3, 0.7);
  
  if (random() > 0.5) { // Split vertically
    drawCell(x, y, w * splitRatio, h, depth - 1);
    drawCell(x + w * splitRatio, y, w * (1 - splitRatio), h, depth - 1);
  } else { // Split horizontally
    drawCell(x, y, w, h * splitRatio, depth - 1);
    drawCell(x, y + h * splitRatio, w, h * (1 - splitRatio), depth - 1);
  }
}

function drawFinalShape(x, y, w, h) {
  push();
  translate(x + w / 2, y + h / 2);
  
  // Pick a random color from the palette for the shape
  const shapeColor = random(palette);
  
  // Randomly decide on fill/stroke
  if (random() > 0.5) {
    fill(shapeColor);
    noStroke();
  } else {
    noFill();
    stroke(shapeColor);
    strokeWeight(random(2, 6));
  }

  // Randomly choose a shape to draw
  const shapeType = floor(random(4));
  
  switch (shapeType) {
    case 0: // Circle
      ellipse(0, 0, min(w, h) * 0.8);
      break;
    case 1: // Rectangle
      rectMode(CENTER);
      rotate(random(-PI / 4, PI / 4));
      rect(0, 0, w * 0.8, h * 0.8, random(10)); // Rounded corners
      break;
    case 2: // Arc
      const startAngle = random(TWO_PI);
      const endAngle = startAngle + random(PI * 0.5, PI * 1.5);
      const diameter = min(w, h) * 0.8;
      arc(0, 0, diameter, diameter, startAngle, endAngle);
      break;
    case 3: // Cross (two lines)
      const margin = min(w,h) * 0.1;
      line(-w/2 + margin, 0, w/2 - margin, 0);
      line(0, -h/2 + margin, 0, h/2 - margin);
      break;
  }
  
  pop();
}
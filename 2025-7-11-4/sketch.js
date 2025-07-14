let movers = [];
let numMovers = 15;
let num = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  for (let i = 0; i < numMovers; i++) {
    const colors = ['#3D74B6e0', '#FBF5DEe0', '#EAC8A6e0', '#DC3C22e0'];
    movers.push(grid(num, colors));
  }
  movers = movers.flat();
}

function draw() {
  background(0,25);
  for (let i = 0; i < movers.length; i++) {
    movers[i].update();
    movers[i].display();
    movers[i].checkEdges();
  }
}

/** num個で分割したグリッドを画面いっぱいに生成する
* @method grid
* @param  {Number}        num           画面の分割数
*/
const grid = (num,colors) => {
    const n1 = num + 1;
  
    const margin_left = width / n1 / n1;
    const margin_bottom = height / n1 / n1;

    const nw = width / n1;
    const nh = height / n1;
    const mov = [];

    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        const x = nw * i + margin_left * (i + 1);
        const y = nh * j + margin_bottom * (j + 1);
        mov.push(new Mover(x, y,nw,nh, colors));
        // circle(x + nw / 2, y + nw / 2, random(nw/2,nw));
      }
    }
    return mov;
};

class Mover {
  constructor(centerX,centerY,w,h,colors) {
    this.position = createVector(random(w), random(h));
    this.velocity = createVector(random(-5, 5), random(-5, 5));
    this.size = random(10, 40);
    this.color = random(colors);
    this.width = w;
    this.height = h;
    this.centerX = centerX;
    this.centerY = centerY;
  }

  update() {
    this.position.add(this.velocity);
  }

  display() {
    fill(this.color);
    push();
    translate(this.centerX, this.centerY);
    rect(this.position.x, this.position.y, this.size, this.size);
    pop();
  }

  checkEdges() {
    if (this.position.x > this.width || this.position.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.position.y > this.height || this.position.y < 0) {
      this.velocity.y *= -1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
// inspired by https://editor.p5js.org/davepagurek/sketches/Q6HAN1qhX
let hellos = [];
let num = 100;

async function loadGoogleFontSet(url, p = window) {
  injectFontLink(url);
  await document.fonts.ready; // ??
  let pfonts = Array.from(document.fonts).map(f => {
    let pf = new p5.Font(p, f);
    pf.path = pf.path || url;
  });
  return pfonts;
}

function injectFontLink(href) {
  const link = document.createElement('link');
  link.id = 'font';
  link.href = href;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

async function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  describe('"hello" is running.', FALLBACK);
  // initHello(100);
  textAlign(CENTER, CENTER);
  await loadGoogleFontSet('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wdth,wght@75..100,200..800&display=swap');
  for(let i = 0; i < num; i++) {
    hellos.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(300, 10, 100);
  // runningHello();
  const t = frameCount / 60 * 1000
  textSize(map(sin(t * 0.001), -1, 1, 32, 128));
  textFont('Bricolage Grotesque', {
    fontVariationSettings: `wght ${map(sin(t * 0.005 ), -1, 1, 200, 800)}`
  });
  for(let i = hellos.length - 1; i >= 0; i--) {
    const hello = hellos[i];
    fill(255, 200);
    text('Hello', hello.x, hello.y);
    hello.x += 1
    hello.y += random(-1, 1);
    if (hello.x < 0 || hello.x > width || hello.y < 0 || hello.y > height) {
      hellos.splice(i, 1);
      hellos.push(createVector(0, random(height)));
    }
  }
}

// function initHello(num) {
//     for (let i = 0; i < num; i++) {
//     let hello = createDiv("Hello");
//     hello.position(random(width), random(height));
//     hello.style("font-size", "32px");
//     hello.style("color", "white");
//     hellos.push(hello);
//   }
// }

// function runningHello() {
//   // ハローが走ってる
//   for (let i = hellos.length - 1; i >= 0; i--) {
//     let hello = hellos[i];
//     hello.position(hello.x +1, hello.y)
//     if (hello.x > width || hello.y > height) {
//       // 画面買いに出たらランダムに配置
//       hello.position(0, random(height));
//     }
//   }
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

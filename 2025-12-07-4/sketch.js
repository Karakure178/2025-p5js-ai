// ぎざぎざ波線 + 全画面シェーダー

const CANVAS_SIZE = 400;
const cols = 18;
const amp = 10;
const step = 4;
const bgCol = "#ffeef5";
const colors = ["#f28da8", "#4c2a86"];

let cnv;
let patternLayer;
let waveShader;

const shader1 = {
  vs: `
  precision highp float;
  precision highp int;

  attribute vec3 aPosition;
  attribute vec2 aTexCoord;

  varying vec2 vTexCoord;

  uniform mat4 uProjectionMatrix;
  uniform mat4 uModelViewMatrix;

  void main() {
    vec4 positionVec4 = vec4(aPosition, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
    vTexCoord = aTexCoord;
  }
`,
  fs: `
  precision highp float;
  precision highp int;

  varying vec2 vTexCoord;

  uniform sampler2D u_tex;
  uniform float u_time;
  uniform vec2 u_resolution;

  float PI = 3.14159265358979;

  void main() {
    vec2 uv = vTexCoord;
    float waveSize = 0.04;
    uv.y += waveSize * sin(uv.x * PI * 5.0 + u_time)* sin(uv.x * PI * 5.0 + u_time);
    vec4 tex = texture2D(u_tex, uv);

    gl_FragColor = tex;
  }
`,
};

function setup() {
  cnv = createCanvas(CANVAS_SIZE, CANVAS_SIZE, WEBGL);
  noStroke();
  patternLayer = createGraphics(CANVAS_SIZE, CANVAS_SIZE);
  waveShader = createShader(shader1.vs, shader1.fs);
}

function draw() {
  drawPattern(patternLayer);

  shader(waveShader);
  waveShader.setUniform("u_tex", patternLayer);
  waveShader.setUniform("u_time", millis() / 1000.0);
  waveShader.setUniform("u_resolution", [width, height]);

  rectMode(CENTER);
  rect(0, 0, width, height);

  resetShader();
}

function drawPattern(pg) {
  pg.push();
  pg.background(bgCol);
  pg.translate(pg.width * 0.1, pg.height * 0.1);
  let w = pg.width * 0.8;
  let h = pg.height * 0.8;

  pg.strokeWeight(6);
  pg.noFill();

  for (let i = 0; i < cols; i++) {
    pg.stroke(colors[i % colors.length]);
    let baseX = (w / (cols - 1)) * i;
    let phase = i * 0.8;

    pg.beginShape();
    for (let y = 0; y <= h; y += step) {
      let t = y * 0.12 + phase;
      let x = baseX + sin(t) * amp * (1 + 0.2 * sin(t * 2));
      pg.vertex(x, y);
    }
    pg.endShape();
  }
  pg.pop();
}

function keyPressed() {
  if (key === "s") {
    //saveCanvas(cnv, "canvas", "png");
    saveGif("canvas", 2);
  }
}

const colors = [
  "#5EABD6",
  "#FFB4B4",
  "#E14434",
  "#03A6A1",
  "#FFA673",
  "#FF4F0F",
  "#FFD66B",
];
let colorSelect = [];
let num = 10;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  rectMode(CENTER);
  noStroke();
  theShader1 = createFilterShader(shader1.fs);
  for (let i = 0; i < num; i++) {
    colorSelect.push([]);
    for (let j = 0; j < num; j++) {
      colorSelect[i].push(random(colors));
    }
  }
}

function draw() {
  translate(-width / 2, -height / 2);
  // background(255);

  noStroke();
  grid(num, colorSelect);

  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, canvas);
    theShader1.setUniform(`u_time`, frameCount / 35);
    filter(theShader1);
  };

  shaderImage();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/** num個で分割したグリッドを画面いっぱいに生成する
 * @method grid
 * @param  {Number}        num           画面の分割数
 */
const grid = (num, colors) => {
  const n1 = num + 1;

  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;

  const nw = width / n1;
  const nh = height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      fill(colors[i][j]);
      circle(x + nw / 2, y + nw / 2, nw / 2);
    }
  }
};

const shader1 = {
  fs: `
precision highp float;
precision highp int;

varying vec2 vTexCoord;

uniform sampler2D u_tex;
uniform float u_time;

float pi = 3.14159265358979;

// ノイズ関数
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// フラクタルノイズ（fbm）
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

float random(vec2 c) {
    return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vTexCoord;
    
    // fbmによる歪み
    float distortion = fbm(uv * 8. + u_time * 0.1) * 0.5;
    vec2 distortedUV = uv + vec2(distortion, distortion * 0.7);
    
    // ノイズ効果（点滅なしの固定ノイズ）
    float whiteNoise = (random(uv) * 2.0 - 1.0) * 0.08; 

    vec4 tex = texture2D(u_tex, fract(distortedUV));
    gl_FragColor = tex + whiteNoise;
}
`,
};

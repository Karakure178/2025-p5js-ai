// 花火の静止画描画 2025-08-13
// 1フレームのみ生成し、その後は止める

let generated = false;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  theShader1 = createFilterShader(shader1.fs);
  //noFill();
  stroke(255);
  strokeWeight(2);
  rectMode(CENTER);

  noLoop(); // draw は1回だけ
}

function draw() {
  translate(-width / 2, -height / 2);
  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, canvas);
    theShader1.setUniform(`u_time`, frameCount / 35);
    filter(theShader1);
  };
  drawFractal(10);
  drawFirework(10);

  shaderImage();
  noLoop();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function drawFractal(num) {
  // フラクタルの描画
  rect(100, 100, num * 100, num * 100);
  rect(width - 100, height - 100, num * 100, num * 100);
  if (num > 0) {
    drawFractal(num - 1);
  }
}

function drawFirework(num) {
  const angle = 360 / num;
  push();
  fill(0);
  translate(width / 2, height / 2);
  for (let i = 0; i < num; i++) {
    const x = cos(radians(angle * i)) * 100;
    const y = sin(radians(angle * i)) * 100;
    rect(x, y, 100, 100);
  }
  pop();
}

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
    float distortion = fbm(uv * 8. + u_time * 0.1) * 0.01;
    vec2 distortedUV = uv + vec2(distortion, distortion);
    
    // ノイズ効果（点滅なしの固定ノイズ）
    float whiteNoise = (random(uv) * 2.0 - 1.0) * 0.09; 

    vec4 tex = texture2D(u_tex, fract(distortedUV));
    //tex = vec4(distortion,distortion,distortion, 1.0);

    gl_FragColor = tex + whiteNoise;
}
`,
};

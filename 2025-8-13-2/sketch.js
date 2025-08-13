// 花火の静止画描画 2025-08-13
// 1フレームのみ生成し、その後は止める

let generated = false;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  theShader1 = createFilterShader(shader1.fs);
  //noFill();
  stroke(255);
  strokeWeight(2);

  noLoop(); // draw は1回だけ
}

function draw() {
  translate(-width / 2, -height / 2);
  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, canvas);
    theShader1.setUniform(`u_time`, frameCount / 35);
    filter(theShader1);
  };
  drawFirework();

  // shaderImage();
  noLoop();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function drawFirework() {
  const cx = width / 2;
  const cy = height / 2;
  const radius = 320;
  // 中心にフラクタル円
  drawCircleFractal(cx, cy, radius, 5);
}

// 円フラクタルを再帰で描画
// depth: 再帰の深さ、r: 現在の半径
// 配置: 親円の内部に 6 個の子円を正六角形状に配置（子半径 = 親*0.38）+ 中央
function drawCircleFractal(x, y, r, depth) {
  if (depth < 0) return;

  // 深さに応じて色を変える（HSB を利用するなら colorMode(HSB) だが既存環境は RGB のまま簡易変換）
  const t = depth / 6.0;
  stroke(lerpColorVal(40, 255, t));
  noFill();
  circle(x, y, r * 2); // p5 の circle は直径指定

  if (depth === 0 || r < 4) return;

  const childR = r * 0.38; // 重なり気味で面白い密度
  const angleStep = TWO_PI / 6.0;
  for (let i = 0; i < 6; i++) {
    const a = angleStep * i;
    const nx = x + (r - childR) * 0.95 * Math.cos(a);
    const ny = y + (r - childR) * 0.95 * Math.sin(a);
    drawCircleFractal(nx, ny, childR, depth - 1);
  }
  // 中央にも 1 つだけ（密度追加）
  drawCircleFractal(x, y, childR, depth - 1);
}

// 単純な数値補間でグレースケール → 明彩度アップ風
function lerpColorVal(a, b, t) {
  const v = a + (b - a) * t;
  return v; // stroke は1値指定でグレースケール
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
    vec2 distortedUV = uv + vec2(distortion, distortion * 0.7);
    
    // ノイズ効果（点滅なしの固定ノイズ）
    float whiteNoise = (random(uv) * 2.0 - 1.0) * 0.08; 

    vec4 tex = texture2D(u_tex, fract(distortedUV));
    gl_FragColor = tex + whiteNoise;
}
`,
};

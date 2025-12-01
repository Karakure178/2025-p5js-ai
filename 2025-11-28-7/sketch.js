let pg; // 2Dオフスクリーン
let scribble; // scribbleインスタンス
let theShader; // GLSLシェーダ
let aperture = 120.0; // 魚眼歪みの視野角（度）

// 頂点シェーダ
const vertSrc = `
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
`;

// フラグメントシェーダ（Shadertoy風FBM歪み＋scribble合成）
const fragSrc = `
precision mediump float;

#define PI 3.14159265359
#define TAU 6.28318530718
#define MAX_ITER 5

uniform sampler2D u_tex;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_aperture;

varying vec2 vTexCoord;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;

  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(st * frequency);
    frequency *= 2.3;
    amplitude *= 0.5;
    st += 13.37;
  }

  return value;
}

vec3 shadertoyPattern(vec2 uv, float time) {
  vec2 p = mod(uv * TAU, TAU) - 250.0;
  vec2 i = vec2(p);
  float c = 1.0;
  float inten = 0.005;

  for (int n = 0; n < MAX_ITER; n++) {
    float t = time * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(
      cos(t - i.x) + sin(t + i.y),
      sin(t - i.y) + cos(t + i.x)
    );
    vec2 denom = vec2(
      p.x / (sin(i.x + t) / inten),
      p.y / (cos(i.y + t) / inten)
    );
    c += 1.0 / length(denom);
  }

  c /= float(MAX_ITER);
  c = 1.17 - pow(c, 1.4);
  vec3 colour = vec3(pow(abs(c), 8.0));
  colour = clamp(colour + vec3(0.61, 0.78, 0.86), 0.0, 1.0);
  return colour;
}

void main() {
  vec2 uv = vTexCoord;
  vec2 originalUV = uv;

  float apertureHalf = 0.5 * u_aperture * (PI / 180.0);
  float maxFactor = sin(apertureHalf);

  vec2 xy = 3.0 * uv.xy - 1.5;
  float d = length(xy);

  if (d < (2.0 - maxFactor)) {
    d = length(xy * maxFactor);
    float z = sqrt(1.0 - d * d);
    float r = atan(d, z) / PI;
    float phi = atan(xy.y, xy.x);

    uv.x = r * cos(phi) + 0.5;
    uv.y = r * sin(phi) + 0.5;
  }

  float t = u_time * 0.7;
  vec2 fbmSample = vec2(
    fbm(uv * 15.0 + vec2(t, -t * 1.3)),
    fbm(uv * 15.0 - vec2(t * 1.1, t))
  );
  vec2 crazy = vec2(
    fbm(uv * 40.0 + fbmSample + vec2(-t * 1.7, t * 0.5)),
    fbm(uv * 25.0 - fbmSample + vec2(t * 0.3, t * 1.4))
  );
  vec2 warp = (fbmSample + crazy * 1.3) - 1.0;
  uv += warp * 0.25;
  uv = fract(uv);

  vec2 fragCoord = uv * u_resolution;
  float time = u_time * 0.5 + 23.0;

  vec3 bg = shadertoyPattern(fragCoord / u_resolution, time);
  vec4 tex = texture2D(u_tex, uv);
  vec3 col = mix(bg, tex.rgb, tex.a);

  float distFromCenter = length(originalUV - 0.5);
  float vignette = smoothstep(0.2, 0.75, distFromCenter);
  float brightness = mix(1.35, 0.55, vignette);
  col *= brightness;

  float dotSize = 7.0;
  vec2 dotCell = fract(fragCoord / dotSize) - 0.5;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  float dotRadius = mix(0.15, 0.48, 1.0 - lum);
  float dotMask = 1.6 - smoothstep(dotRadius - 0.02, dotRadius, length(dotCell));
  vec3 paper = vec3(1.0);
  col = mix(paper, col, dotMask);

  gl_FragColor = vec4(col, 1.0);
}
`;

let pastelColors;

function setup() {
  createCanvas(600, 600, WEBGL);

  // 2Dオフスクリーン（透明にして使う）
  pg = createGraphics(600, 600);
  pg.pixelDensity(1);

  // scribble を p5.Graphics 用にインスタンスモードで
  scribble = new Scribble(pg);

  // シェーダ作成
  theShader = createShader(vertSrc, fragSrc);

  // ゆめかわ配色（パステル系）
  pastelColors = [
    [255, 204, 229], // ピンク
    [204, 255, 229], // ミント
    [229, 204, 255], // ラベンダー
    [255, 255, 204], // レモン
    [204, 229, 255], // ベビーブルー
  ];

  noStroke();
  noLoop();
}

function draw() {
  // ---- scribbleでゆめかわ線を描く（透明背景）----
  pg.clear();
  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);

  // scribble設定（ふにゃっと）
  scribble.roughness = 2.8;
  scribble.bowing = 1.2;
  scribble.maxOffset = 2.5;

  // ゆめかわ配色でランダムに丸・四角を重ねる
  let count = 10;
  for (let i = 0; i < count; i++) {
    let angle = (TWO_PI / count) * i + frameCount * 0.01;
    let radius = 120;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    // ランダムなパステル色
    let c = random(pastelColors);
    pg.stroke(c[0], c[1], c[2], 230);
    pg.strokeWeight(4);
    pg.noFill();

    let w = random(60, 120);
    let h = random(40, 100);

    if (random() < 0.5) {
      // 手描き四角
      pg.push();
      pg.translate(x, y);
      pg.rotate(angle * 0.8);
      scribble.scribbleRect(0, 0, w, h);
      pg.pop();
    } else {
      // 手描き円
      pg.push();
      pg.translate(x, y);
      scribble.scribbleEllipse(0, 0, w, w);
      pg.pop();
    }
  }

  pg.pop();

  // ---- WEBGL側でシェーダ適用 ----
  shader(theShader);

  theShader.setUniform("u_tex", pg);
  theShader.setUniform("u_time", frameCount / 60.0);
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_aperture", aperture);

  rectMode(CENTER);
  rect(0, 0, width, height);
}

// キーを押すたびに新しいゆめかわパターンを生成
function keyPressed() {
  if (key === "s") {
    saveCanvas("knitting-chart", "png");
  }
}

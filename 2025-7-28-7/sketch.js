// p5.js + インタラクティブGLSL
let myShader;
let time = 0;

// バーテックスシェーダー
const vert = `
#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;

// フラグメントシェーダー - マウス位置に反応する液体風
const frag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
varying vec2 vTexCoord;

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

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 st = vTexCoord;
    vec2 uv = st * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // マウス位置を正規化
    vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0;
    mouse.x *= u_resolution.x / u_resolution.y;
    
    // マウスからの距離
    float mouseDistance = length(uv - mouse);
    
    // 時間による波紋効果
    vec2 center = vec2(0.0);
    float dist = length(uv - center);
    
    // 複数の波源
    float wave1 = sin(dist * 10.0 - u_time * 3.0) * exp(-dist * 2.0);
    float wave2 = sin(mouseDistance * 15.0 - u_time * 4.0) * exp(-mouseDistance * 1.5);
    
    // ノイズによる歪み
    vec2 noisePos = uv + u_time * 0.1;
    float n = fbm(noisePos * 3.0);
    
    // 液体のような歪み
    uv += n * 0.1;
    uv += sin(u_time + uv.x * 5.0) * 0.02;
    uv += cos(u_time * 1.3 + uv.y * 4.0) * 0.02;
    
    // マウス位置での渦効果
    vec2 toMouse = uv - mouse;
    float mouseEffect = 1.0 / (1.0 + mouseDistance * 3.0);
    float angle = atan(toMouse.y, toMouse.x) + u_time * 2.0 * mouseEffect;
    
    // 色の計算
    float hue = angle / 6.28318 + n * 0.3 + u_time * 0.1;
    float saturation = 0.7 + mouseEffect * 0.3;
    float brightness = 0.3 + wave1 * 0.2 + wave2 * 0.3 + mouseEffect * 0.4;
    
    // メタボール効果
    float blob1 = 1.0 / (1.0 + length(uv - vec2(sin(u_time), cos(u_time * 1.3))) * 5.0);
    float blob2 = 1.0 / (1.0 + length(uv - vec2(cos(u_time * 0.8), sin(u_time * 0.6))) * 4.0);
    float blob3 = 1.0 / (1.0 + length(uv - mouse) * 3.0);
    
    float metaball = blob1 + blob2 + blob3;
    brightness += metaball * 0.2;
    
    // グラデーション効果
    vec2 gradient = uv * 0.5 + 0.5;
    brightness *= 0.5 + 0.5 * (gradient.x + gradient.y);
    
    vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
    
    // 縁の効果
    float edge = 1.0 - smoothstep(0.8, 1.0, length(uv));
    color *= edge;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

function setup() {
  createCanvas(800, 800, WEBGL);

  // シェーダーを作成
  myShader = createShader(vert, frag);
}

function draw() {
  background(0);

  // シェーダーを使用
  shader(myShader);

  // ユニフォーム変数を設定
  myShader.setUniform("u_resolution", [width, height]);
  myShader.setUniform("u_time", time);
  myShader.setUniform("u_mouse", [mouseX, mouseY]);

  // 全画面の四角形を描画
  noStroke();
  rectMode(CENTER);
  rect(0, 0, width, height);

  time += 0.02;
}

// キーボードで効果をリセット
function keyPressed() {
  if (key === " ") {
    time = 0;
  }
}

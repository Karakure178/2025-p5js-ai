let glassShader;
let bgLayer;
let angle = 0;

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  glassShader = createShader(vert, frag);

  // 背景用のオフスクリーンバッファ
  bgLayer = createGraphics(width, height);
}

function draw() {
  // 背景をまず描画
  bgLayer.background(20, 30, 80);
  bgLayer.noStroke();

  // 適当に動く模様
  for (let i = 0; i < 20; i++) {
    bgLayer.fill(
      200 + sin(frameCount * 0.01 + i) * 55,
      100 + i * 5,
      150 + cos(frameCount * 0.02 + i) * 55
    );
    let x = width / 2 + cos(frameCount * 0.01 + i) * 200;
    let y = height / 2 + sin(frameCount * 0.013 + i) * 200;
    bgLayer.ellipse(x, y, 100, 100);
  }

  // シェーダーに背景を渡す
  shader(glassShader);
  glassShader.setUniform("uTex0", bgLayer);
  glassShader.setUniform("uResolution", [width, height]);
  glassShader.setUniform("uTime", millis() * 0.001);

  rotateY(angle);
  angle += 0.01;

  sphere(150, 100, 100);
}

const vert = `
precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(aNormal);
  vPosition = aPosition;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}
`;

const frag = `
precision mediump float;

uniform sampler2D uTex0;
uniform vec2 uResolution;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // 法線
  vec3 N = normalize(vNormal);

  // 視線ベクトル（カメラ位置をZ軸正方向に仮定）
  vec3 I = normalize(vPosition);

  // 屈折率（ガラス: 1.5）
  float eta = 1.0 / 1.5;

  // スネルの法則による屈折ベクトル
  vec3 refractDir = refract(I, N, eta);

  // スクリーン座標に変換
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv += refractDir.xy * 0.2; // 屈折の強さを調整

  // 背景色をサンプリング
  vec3 refractedColor = texture2D(uTex0, uv).rgb;

  // ガラスのティントを少し加える
  vec3 glassTint = vec3(0.7, 0.9, 1.0);
  vec3 finalColor = mix(refractedColor, glassTint, 0.15);

  gl_FragColor = vec4(finalColor, 0.5); // 半透明
}
`;

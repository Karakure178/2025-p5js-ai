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

    //bgLayer.fill(200 + sin(i) * 55, 100 + i * 5, 150 + cos(i) * 55);

    let x = width / 2 + cos(frameCount * 0.01 + i) * 200;
    let y = height / 2 + sin(frameCount * 0.01 + i) * 200;
    bgLayer.ellipse(x, y, 100, 100);
  }

  // シェーダーに背景を渡す
  shader(glassShader);
  glassShader.setUniform("uTex0", bgLayer);
  glassShader.setUniform("uResolution", [width, height]);
  glassShader.setUniform("uTime", millis() * 0.001);

  rotateY(angle);
  angle += 0.01;

  translate(-width / 2, -height / 2);

  // 全画面の四角形を描画
  rect(0, 0, width, height);
}

const vert = `
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

const frag = `
precision highp float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uTex0;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 fragColor = texture2D(uTex0, uv).rgb;
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

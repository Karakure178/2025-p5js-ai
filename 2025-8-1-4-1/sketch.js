// 合成を試したプログラム

let glassShader;
let bgLayer, bgTexture;
let circles = [];
let angle = 0;

function preload() {}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  glassShader = createShader(vert, frag);

  // 背景用のオフスクリーンバッファ
  bgLayer = createGraphics(width, height);
  bgTexture = createGraphics(width, height);
  bgTexture.noStroke();
  bgTexture.fill(255);

  // ランダムな円を生成
  circles = getRandomCircles(1000, width, height);
}

function draw() {
  // 背景をまず描画
  bgLayer.background(255);
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

  // ランダムな円を描画
  for (let circle of circles) {
    bgTexture.ellipse(circle.x, circle.y, circle.z, circle.z);
  }

  // シェーダーに背景を渡す
  shader(glassShader);
  glassShader.setUniform("uTex0", bgLayer);
  glassShader.setUniform("uTex1", bgTexture);
  glassShader.setUniform("uResolution", [width, height]);
  glassShader.setUniform("uTime", millis() * 0.001);

  rotateY(angle);
  angle += 0.01;

  translate(-width / 2, -height / 2);

  // 全画面の四角形を描画
  rect(0, 0, width, height);
}

function getRandomCircles(_num, _w, _h) {
  let circles = [];
  for (let i = 0; i < _num; i++) {
    let x = random(-1, 1) * _w;
    let y = random(-1, 1) * _h;
    let z = random(30, 200); // z軸の値を円の大きさとして使用
    if (circles.every((c) => dist(x, y, c.x, c.y) > (z + c.z) * 0.5)) {
      circles.push(createVector(x, y, z));
    }
  }
  return circles;
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
uniform sampler2D uTex1;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec4 tex = texture2D(uTex0, uv);
    vec4 tex_lattice = texture2D(uTex1, uv);
    
    // アンチエイリアスのための境界検出
    vec2 texelSize = 1.0 / uResolution.xy;
    float edge = 0.0;
    
    // 周辺のピクセルをサンプリングして境界を検出
    for (float x = -1.0; x <= 1.0; x++) {
        for (float y = -1.0; y <= 1.0; y++) {
            vec2 offset = vec2(x, y) * texelSize;
            vec4 sample_lattice = texture2D(uTex1, uv + offset);
            edge += length(sample_lattice - tex_lattice);
        }
    }
    
    // エッジの強度を正規化
    edge = clamp(edge * 0.5, 0.0, 1.0);
    
    // 白との比較（より滑らかな判定）
    float whiteness = length(tex_lattice.rgb - vec3(1.0));
    float isWhite = 1.0 - smoothstep(0.0, 0.2, whiteness);
    
    // 通常の色と反転色を計算
    vec4 normalColor = tex;
    vec4 invertedColor = vec4(vec3(1.0) - tex.rgb, 1.0);
    
    // エッジ部分では滑らかに混合
    vec4 finalColor = mix(invertedColor, normalColor, isWhite);
    
    // エッジでさらに滑らかに補間
    if (edge > 0.1) {
        vec4 blendedColor = mix(finalColor, tex, edge * 0.3);
        gl_FragColor = blendedColor;
    } else {
        gl_FragColor = finalColor;
    }
}
`;

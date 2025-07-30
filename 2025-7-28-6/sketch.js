// p5.js + シンプルなGLSL
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

// フラグメントシェーダー - カラフルな波紋
const frag = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 vTexCoord;

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (vTexCoord * 2.0 - 1.0) * 2.0;
    uv.x *= u_resolution.x / u_resolution.y; // アスペクト比補正
    
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;
        
        float d = length(uv) * exp(-length(uv0));
        
        vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.4);
        
        d = sin(d * 8.0 + u_time) / 8.0;
        d = abs(d);
        
        d = pow(0.01 / d, 1.2);
        
        finalColor += col * d;
    }
        
    gl_FragColor = vec4(finalColor, 1.0);
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

  // 全画面の四角形を描画
  noStroke();
  rectMode(CENTER);
  rect(0, 0, width, height);

  time += 0.02;
}

// マウスクリックで時間をリセット
function mousePressed() {
  time = 0;
}

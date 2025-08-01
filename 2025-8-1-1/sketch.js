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
// inspired by https://www.shadertoy.com/view/3cdXDX
precision highp float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uTex0;
uniform vec2 uResolution;
uniform float uTime;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 m2 = (uv - 0.5) * 2.0;
    
    float roundedBox = pow(abs(m2.x * uResolution.x / uResolution.y), 16.0) + pow(abs(m2.y), 8.0);    
    float rb1 = clamp((1.0 - roundedBox * 10000.0) * 8.0, 0.0, 1.0); // rounded box
    float rb2 = clamp((0.95 - roundedBox * 9500.0) * 16.0, 0.0, 1.0) - clamp(pow(0.9 - roundedBox * 9500.0, 1.0) * 16.0, 0.0, 1.0); // borders
    float rb3 = (clamp((1.5 - roundedBox * 11000.0) * 2.0, 0.0, 1.0) - clamp(pow(1.0 - roundedBox * 11000.0, 1.0) * 2.0, 0.0, 1.0)); // shadow gradient

    vec4 fragColor = vec4(0.0);
    float transition = smoothstep(0.0, 1.0, rb1 + rb2);
    
    if (transition > 0.0) {
        vec2 lens;
        
        // Sample 0
        lens = ((uv - 0.5) * 1.0 * (1.0 - roundedBox * 5000.0) + 0.5);

        // Blur
        float total = 0.0;
        for (float x = -4.0; x <= 4.0; x++) {
            for (float y = -4.0; y <= 4.0; y++) {
                vec2 offset = vec2(x, y) * 0.5 / uResolution.xy;
                fragColor += texture2D(uTex0, offset + lens);
                total += 1.0;
            }
        } 
        fragColor /= total;
        
        // Lighting
        float gradient = clamp((clamp(m2.y, 0.0, 0.2) + 0.1) / 2.0, 0.0, 1.0) + clamp((clamp(-m2.y, -1000.0, 0.2) * rb3 + 0.1) / 2.0, 0.0, 1.0);
        vec4 lighting = clamp(fragColor + vec4(rb1) * gradient + vec4(rb2) * 0.3, 0.0, 1.0);
        
        // Antialiasing
        fragColor = mix(texture2D(uTex0, uv), lighting, transition);
        
    } else { 
        fragColor = texture2D(uTex0, uv);
    }
    
    gl_FragColor = fragColor;
    fragColor = texture2D(uTex0, uv);
}
`;

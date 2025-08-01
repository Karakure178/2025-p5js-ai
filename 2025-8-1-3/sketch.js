let glassShader;
let bgLayer;

let radius = 20;
let span = 100;
let threshold = 120;
let time = 0;
const xy = [];

function setup() {
  createCanvas(800, 800, WEBGL);
  noStroke();
  glassShader = createShader(vert, frag);

  // 背景用のオフスクリーンバッファ
  bgLayer = createGraphics(width, height);
  bgLayer.background(240);
  stroke(40);

  s = 20;
  for (let i = 0; i < 200; i++) {
    const x = random(width);
    const y = random(height);
    const a = -PI / 2;

    xy.push(createVector(x, y, a));
  }
}

function draw() {
  bgLayer.background(240);
  for (let i = 0; i < xy.length; i++) {
    const v = xy[i];
    bgLayer.push();
    bgLayer.translate(
      v.x + noise(v.x * 0.01, v.y * 0.01, frameCount * 0.01) * 100,
      v.y + noise(v.x * 0.01, v.y * 0.01, frameCount * 0.01) * 100
    );
    bgLayer.strokeWeight(20);
    bgLayer.stroke(v.y, 150, v.y / 2);
    bgLayer.line(0, 0, v.x + cos(v.z) * s, v.y + sin(v.z) * s);
    bgLayer.pop();
  }

  time += 0.01;
  let locations = [];

  // シンプルなグリッド位置を生成
  for (let x = span; x < width - span; x += span) {
    for (let y = span; y < height - span; y += span) {
      // 波のような動きを追加
      let waveX = sin(time * 2 + x * 0.01) * 30;
      let waveY = cos(time * 1.5 + y * 0.01) * 20;

      // パーリンノイズによる有機的な動き
      let noiseX = map(noise(x * 0.01, y * 0.01, time), 0, 1, -40, 40);
      let noiseY = map(
        noise(x * 0.01 + 100, y * 0.01 + 100, time),
        0,
        1,
        -40,
        40
      );

      let location = createVector(x + waveX + noiseX, y + waveY + noiseY);
      locations.push(location);
    }
  }

  // シンプルな接続線を描画
  for (let i = 0; i < locations.length; i++) {
    let location = locations[i];

    for (let j = i + 1; j < locations.length; j++) {
      let other = locations[j];
      let distance = p5.Vector.dist(location, other);

      if (distance < threshold) {
        // シンプルな線
        bgLayer.stroke(40, 150);
        bgLayer.strokeWeight(2);
        bgLayer.line(location.x, location.y, other.x, other.y);
      }
    }

    // シンプルな円
    bgLayer.fill(40);
    bgLayer.noStroke();
    bgLayer.strokeWeight(6);

    bgLayer.circle(location.x, location.y, 8);
  }

  // シェーダーに背景を渡す
  shader(glassShader);
  glassShader.setUniform("uTex0", bgLayer);
  glassShader.setUniform("uResolution", [width, height]);
  glassShader.setUniform("uTime", millis() * 0.001);

  translate(-width / 2, -height / 2);
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
    
    float roundedBox = pow(abs(m2.x * uResolution.x / uResolution.y), 5000.0) + pow(abs(m2.y), 5000.0);    
    float rb1 = clamp((1.0 - roundedBox * 2000.0) * 8.0, 0.0, 1.0); // rounded box（より大きく）
    float rb2 = clamp((0.95 - roundedBox * 1900.0) * 16.0, 0.0, 1.0) - clamp(pow(0.9 - roundedBox * 1900.0, 1.0) * 16.0, 0.0, 1.0); // borders
    float rb3 = (clamp((1.5 - roundedBox * 2200.0) * 2.0, 0.0, 1.0) - clamp(pow(1.0 - roundedBox * 2200.0, 1.0) * 2.0, 0.0, 1.0)); // shadow gradient

    vec4 fragColor = vec4(0.0);
    float transition = smoothstep(0.0, 1.0, rb1 + rb2);
    
    if (transition > 0.0) {
        vec2 lens;
        
        // 拡大率
        lens = ((uv - 0.5) * 1.0 * (1.0 - roundedBox * 1000.0) + 0.5);

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
}
`;

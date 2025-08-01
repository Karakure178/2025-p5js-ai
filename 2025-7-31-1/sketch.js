let radius = 20;
let span = 100;
let threshold = 120;
let time = 0;
let canvas;
function setup() {
  canvas = createCanvas(800, 800);
  background(240);
  stroke(40);
  strokeWeight(3);
  theShader1 = createFilterShader(shader1.fs);
}

function draw() {
  background(240);
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
        stroke(40, 150);
        line(location.x, location.y, other.x, other.y);
      }
    }

    // シンプルな円
    fill(40);
    noStroke();
    circle(location.x, location.y, 8);
  }

  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, canvas);
    theShader1.setUniform(`u_time`, frameCount / 35);
    filter(theShader1);
  };

  shaderImage();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
    
    // シンプルなオイルペイント風の効果
    vec3 finalColor = vec3(0.0);
    float totalWeight = 0.0;
    
    // 適度な範囲でサンプリング
    for (int i = -2; i <= 2; i++) {
        for (int j = -2; j <= 2; j++) {
            vec2 offset = vec2(float(i), float(j)) / 800.0;
            
            // 軽い歪み効果
            float distortion = fbm(uv * 5.0 + u_time * 0.02) * 0.1;// ここを調整すると歪む
            vec2 sampleUV = uv + offset + vec2(distortion, distortion * 0.8);
            
            vec4 sampleColor = texture2D(u_tex, sampleUV);
            
            // 距離に基づく重み
            float distance = length(offset);
            float weight = exp(-distance * 12.0);
            
            // 色の類似度による重み（軽く）
            vec4 centerColor = texture2D(u_tex, uv);
            float colorSimilarity = 1.0 - length(sampleColor.rgb - centerColor.rgb) * 0.5;
            weight *= colorSimilarity;
            
            finalColor += sampleColor.rgb * weight;
            totalWeight += weight;
        }
    }
    
    finalColor /= totalWeight;
    
    // 軽いブラシテクスチャ
    float brushTexture = fbm(uv * 15.0) * 0.5;
    finalColor += brushTexture;

    
    // 適度な彩度向上
    float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(luminance), finalColor, 1.1);
    
    gl_FragColor = texture2D(u_tex, uv);
    //vec4(finalColor, 1.0);
}
`,
};

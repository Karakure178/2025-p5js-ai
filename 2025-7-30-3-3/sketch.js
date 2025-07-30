const colors = [];
const colorSelect = [
  "#FF7A30",
  "#465C88",
  "#000000",
  "#FF4757",
  "#3742FA",
  "#2ED573",
];
let numShapes = 12;
let canvas;
let rotationSpeeds = [];

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  rectMode(CENTER);
  noStroke();

  for (let i = 0; i < numShapes; i++) {
    colors.push([]);
    rotationSpeeds.push([]);
    for (let j = 0; j < numShapes; j++) {
      colors[i].push(random(colorSelect));
      rotationSpeeds[i].push(random(0.005, 0.02));
    }
  }
  theShader1 = createFilterShader(shader1.fs);
}

function draw() {
  // 紙のような背景色
  background(250, 248, 240);

  // 柔らかいライティング（スケッチ風）
  ambientLight(120);
  directionalLight(80, 80, 80, -0.5, 0.5, -1);

  translate(-width / 2, -height / 2);

  let spacing = min(width, height) / numShapes;
  let time = frameCount * 0.02;

  for (let i = 0; i < numShapes; i++) {
    for (let j = 0; j < numShapes; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      let d = dist(width / 2, height / 2, x, y);
      let normalizedD = d / (width * 0.5);

      // より有機的な波動（手描き風の不規則性）
      let wave1 = sin(d * 0.04 + time * 1.5 + noise(i * 0.1, j * 0.1) * 2);
      let wave2 = cos(d * 0.06 + time * -1.2 + noise(i * 0.2, j * 0.2) * 1.5);
      let wave3 = sin(normalizedD * PI * 1.8 + time * 2.2);

      let combinedWave = (wave1 + wave2 * 0.8 + wave3 * 0.6) / 2.4;

      let size = map(combinedWave, -1, 1, spacing * 0.1, spacing * 0.7);

      // スケッチ風の色（グレースケール中心）
      let grayValue = map(sin(d * 0.03 + time * 1.2), -1, 1, 60, 180);
      let currentColor = color(
        grayValue + random(-10, 10),
        grayValue + random(-5, 5),
        grayValue + random(-5, 5)
      );

      // 手描き風の不規則な位置調整
      let jitterX = noise(i * 0.5, j * 0.5, time * 0.5) * 3 - 1.5;
      let jitterY = noise(i * 0.7, j * 0.7, time * 0.3) * 3 - 1.5;

      push();
      translate(x + jitterX, y + jitterY, sin(d * 0.03 + time) * 15);

      // より有機的な回転（手描きの自然さ）
      let speed = rotationSpeeds[i][j] * 0.5; // 回転を遅く
      rotateX(frameCount * speed + noise(i, j) * 0.2);
      rotateY(frameCount * speed * 1.2 + noise(i + 10, j + 10) * 0.3);
      rotateZ(frameCount * speed * 0.8 + noise(i + 20, j + 20) * 0.1);

      // スケッチ風の輪郭線
      stroke(40, 40, 50);
      strokeWeight(1 + random(-0.3, 0.3)); // 線の太さにゆらぎ
      fill(currentColor);

      // よりシンプルな形状（スケッチ風）
      let shapeType = floor(map(sin(d * 0.02 + time * 0.6), -1, 1, 0, 2));

      if (shapeType === 0) {
        // 手描き風の立方体（わずかに歪む）
        push();
        scale(1 + noise(frameCount * 0.01 + i + j) * 0.05 - 0.025);
        box(size);
        pop();
      } else {
        // 手描き風の球（完全に丸くない）
        push();
        scale(
          1 + noise(frameCount * 0.02 + i) * 0.08 - 0.04,
          1 + noise(frameCount * 0.03 + j) * 0.08 - 0.04,
          1 + noise(frameCount * 0.025 + i + j) * 0.08 - 0.04
        );
        sphere(size * 0.6);
        pop();
      }

      pop();
    }
  }

  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, canvas);
    theShader1.setUniform(`u_time`, frameCount / 30);
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
  vs: `
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
`,
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

   // フラクタルノイズ
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

   // 色相変換
   vec3 hsv2rgb(vec3 c) {
       vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
       vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
       return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
   }

   void main() {
      vec2 uv = vTexCoord;
      vec2 originalUV = uv;
      
      // 手書き風のノイズによる歪み
      vec2 noisePos = uv * 12.0 + u_time * 0.2;
      float noiseX = (noise(noisePos) - 0.5) * 0.003;
      float noiseY = (noise(noisePos + vec2(100.0, 100.0)) - 0.5) * 0.003;
      
      // 手の震えを模倣した微細な振動
      float tremble = sin(u_time * 15.0 + uv.x * 50.0) * 0.0005;
      tremble += cos(u_time * 12.0 + uv.y * 40.0) * 0.0005;
      
      uv.x += noiseX + tremble;
      uv.y += noiseY + tremble;
      
      vec4 tex = texture2D(u_tex, uv);
      
      // エッジ検出でスケッチ風の輪郭線
      vec2 texelSize = vec2(1.0) / vec2(800.0, 800.0);
      
      // より複雑なエッジ検出（8方向）
      vec4 edge = vec4(0.0);
      for (int i = -1; i <= 1; i++) {
          for (int j = -1; j <= 1; j++) {
              if (i == 0 && j == 0) continue;
              vec2 offset = vec2(float(i), float(j)) * texelSize;
              edge += texture2D(u_tex, uv + offset) * -1.0;
          }
      }
      edge += texture2D(u_tex, uv) * 8.0;
      
      // 輪郭線の強度
      float edgeIntensity = length(edge.rgb);
      edgeIntensity = smoothstep(0.1, 0.3, edgeIntensity);
      
      // 手書き風のハッチング効果
      vec2 hatchUV = uv * 100.0;
      float hatch1 = sin(hatchUV.x + hatchUV.y) * 0.5 + 0.5;
      float hatch2 = sin(hatchUV.x - hatchUV.y) * 0.5 + 0.5;
      
      // ノイズによるハッチングの不規則性
      float hatchNoise = noise(uv * 50.0 + u_time * 0.1);
      hatch1 = smoothstep(0.3 + hatchNoise * 0.2, 0.7 + hatchNoise * 0.2, hatch1);
      hatch2 = smoothstep(0.4 + hatchNoise * 0.15, 0.8 + hatchNoise * 0.15, hatch2);
      
      // 影の濃さに応じてハッチングの密度を変更
      float brightness = (tex.r + tex.g + tex.b) / 3.0;
      float shadowHatch = 1.0 - smoothstep(0.2, 0.6, brightness);
      
      // クロスハッチング
      float crossHatch = max(hatch1 * shadowHatch, hatch2 * shadowHatch * 0.7);
      
      // 鉛筆のテクスチャ
      float pencilTexture = noise(uv * 200.0 + u_time * 0.05);
      pencilTexture = smoothstep(0.3, 0.7, pencilTexture);
      
      // 紙のテクスチャ
      float paperTexture = fbm(uv * 100.0) * 0.1 + 0.9;
      
      // スケッチ風の色合い（セピア調）
      vec3 sepia = vec3(0.8, 0.7, 0.5);
      tex.rgb = mix(tex.rgb, sepia, 0.3);
      
      // 手書き風の最終合成
      vec3 inkColor = vec3(0.1, 0.1, 0.15); // インクの色
      vec3 paperColor = vec3(0.95, 0.93, 0.88); // 紙の色
      
      // 輪郭線とハッチングを組み合わせ
      float totalInk = max(edgeIntensity, crossHatch * 0.6);
      totalInk = max(totalInk, (1.0 - pencilTexture) * 0.3);
      
      // 最終的な手書き風の効果
      vec3 finalColor = mix(paperColor, inkColor, totalInk);
      finalColor *= paperTexture;
      
      // 古い紙のような色調
      //finalColor = mix(finalColor, vec3(0.9, 0.85, 0.7), 0.1);
      
      gl_FragColor = vec4(finalColor, tex.a);
    }
`,
};

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
  background(10, 10, 15);

  // 動的ライティング
  ambientLight(50);
  let lightX = sin(frameCount * 0.02) * 200;
  let lightY = cos(frameCount * 0.03) * 200;
  directionalLight(100, 150, 200, lightX, lightY, -1);

  translate(-width / 2, -height / 2);

  let spacing = min(width, height) / numShapes;
  let time = frameCount * 0.03;

  for (let i = 0; i < numShapes; i++) {
    for (let j = 0; j < numShapes; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      let d = dist(width / 2, height / 2, x, y);
      let normalizedD = d / (width * 0.5);

      // 複数の波動を合成
      let wave1 = sin(d * 0.03 + time * 2);
      let wave2 = cos(d * 0.05 + time * -1.5);
      let wave3 = sin(normalizedD * PI * 2 + time * 3);
      let wave4 = cos(x * 0.01 + y * 0.01 + time * 2.5);

      let combinedWave =
        (wave1 + wave2 * 0.7 + wave3 * 0.5 + wave4 * 0.3) / 2.5;

      let size = map(combinedWave, -1, 1, spacing * 0.05, spacing * 0.8);

      // 動的な色の変化
      let colorIndex = floor(
        map(sin(d * 0.02 + time * 1.5), -1, 1, 0, colorSelect.length)
      );
      let currentColor = color(colorSelect[colorIndex]);

      // 輝度の動的変化
      let brightness = map(combinedWave, -1, 1, 0.2, 1.5);
      currentColor = lerpColor(color(0, 0, 20), currentColor, brightness);

      push();
      translate(x, y, sin(d * 0.02 + time) * 20);

      // 個別の回転速度
      let speed = rotationSpeeds[i][j];
      rotateX(frameCount * speed);
      rotateY(frameCount * speed * 1.3);
      rotateZ(frameCount * speed * 0.7);

      fill(currentColor);

      // 形状の種類を動的に変更
      let shapeType = floor(map(sin(d * 0.01 + time * 0.8), -1, 1, 0, 3));

      if (shapeType === 0) {
        box(size);
      } else if (shapeType === 1) {
        sphere(size * 0.6);
      } else {
        cylinder(size * 0.4, size * 1.2);
      }

      pop();
    }
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
      
      // 中心からの距離
      vec2 center = vec2(0.5, 0.5);
      float dist = length(uv - center);
      
      // 色収差効果
      float aberration = 0.005;
      vec4 texR = texture2D(u_tex, uv + vec2(aberration, 0.0));
      vec4 texG = texture2D(u_tex, uv);
      vec4 texB = texture2D(u_tex, uv - vec2(aberration, 0.0));
      
      vec4 tex = vec4(texR.r, texG.g, texB.b, texG.a);
      
      // 時間による色調変化
      float hueShift = u_time * 0.1 + dist * 2.0;
      vec3 hsv = vec3(hueShift, 0.3, 1.0);
      vec3 colorShift = hsv2rgb(hsv);
      
      // 最終的な色の合成
      tex.rgb *= (1.0 + colorShift * 0.2);
      
      // エッジ検出風のエフェクト
      vec2 texelSize = vec2(1.0) / vec2(800.0, 800.0);
      vec4 edge = texture2D(u_tex, uv + texelSize) - texture2D(u_tex, uv - texelSize);
      tex.rgb += edge.rgb * 0.3;

      gl_FragColor = tex;
    }
`,
};

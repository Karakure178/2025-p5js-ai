let numShapes = 12;
let canvas;
let rotationSpeeds = [];
const colors = [];
const colorSelect = ["#FF7A30", "#465C88", "#FF4757", "#3742FA"];
function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  rectMode(CENTER);
  shininess(80);

  for (let i = 0; i < numShapes; i++) {
    rotationSpeeds.push([]);
    colors.push([]);
    for (let j = 0; j < numShapes; j++) {
      rotationSpeeds[i].push(random(0.005, 0.02));
      colors[i].push(random(colorSelect));
    }
  }
  theShader1 = createFilterShader(shader1.fs);
}

function draw() {
  // 紙のような背景色
  background(250, 248, 240);
  noStroke();

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

      fill(colors[i][j]);

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

   void main() {
      vec2 uv = vTexCoord;
      vec4 tex = texture2D(u_tex, uv);
      
      // シンプルなクロスハッチング
      vec2 hatchUV = uv * 1000.0;
      float hatch1 = sin(hatchUV.x + hatchUV.y);
      float hatch2 = sin(hatchUV.x - hatchUV.y);
      
      // 影の濃さを基準にハッチングの強度を決定
      float brightness = (tex.r + tex.g + tex.b) / 3.0;
      float shadowIntensity = 1.0 - brightness;
      
      // クロスハッチングパターン
      float crossHatch = 0.0;
      if (shadowIntensity > 0.7) {
          // 非常に暗い部分：両方向のハッチング
          crossHatch = max(
              smoothstep(0.0, 0.3, hatch1),
              smoothstep(0.0, 0.3, hatch2)
          ) * 0.6;
      } else if (shadowIntensity > 0.4) {
          // 中程度の影：一方向のハッチング
          crossHatch = smoothstep(0.0, 0.3, hatch1) * 0.4;
      }
      
      // 元の色とハッチングを合成
      vec3 originalColor = tex.rgb;
      vec3 hatchColor = vec3(0.1, 0.1, 0.15); // ハッチングの色
      
      // エッジ検出で境界線を検出
      vec2 texelSize = vec2(1.0) / vec2(800.0, 800.0);
      vec4 edge = vec4(0.0);
      
      // 8方向のエッジ検出
      for (int i = -1; i <= 1; i++) {
          for (int j = -1; j <= 1; j++) {
              if (i == 0 && j == 0) continue;
              vec2 offset = vec2(float(i), float(j)) * texelSize * 1.2; // オフセットを少し小さくして線を細く
              edge += texture2D(u_tex, uv + offset) * -1.0;
          }
      }
      edge += texture2D(u_tex, uv) * 8.0;
      
      // 輪郭線の強度（線を細くするために閾値を調整）
      float edgeIntensity = length(edge.rgb);
      edgeIntensity = smoothstep(0.08, 0.25, edgeIntensity); // 閾値を上げて線を細く

      // 太い境界線の色
      vec3 borderColor = vec3(0.05, 0.05, 0.1); // より濃い境界線
      
      // 最終的な色の合成（境界線、ハッチング、元の色の順で合成）
      vec3 finalColor = mix(originalColor, hatchColor, crossHatch);
      finalColor = mix(finalColor, borderColor, edgeIntensity * 0.8); // 境界線の強度を調整
      
      gl_FragColor = vec4(finalColor, tex.a);
    }
`,
};

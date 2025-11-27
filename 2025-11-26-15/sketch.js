// グリッド上の円の中にカラフルな三角形を充填（シェーダー適用）

let gridNum = 9; // グリッドの数
let numTrianglesPerCircle = 30; // 各円に配置する三角形の数
let minDistance = 2; // 三角形間の最小距離
let drawLayer; // オフスクリーンバッファ
let noiseShader; // シェーダー
let time = 0;

// シェーダー定義
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
    
    // fbmによる歪み
    float distortion = fbm(uv * 8. + u_time * 0.1) * 0.3;
    vec2 distortedUV = uv + vec2(distortion, distortion * 0.7);
    
    // ノイズ効果（点滅なしの固定ノイズ）
    float whiteNoise = (random(uv) * 2.0 - 1.0) * 0.08; 

    vec4 tex = texture2D(u_tex, fract(distortedUV));
    gl_FragColor = tex + whiteNoise;
}
`,
};

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  colorMode(HSB, 360, 100, 100, 100);

  // オフスクリーンバッファを作成
  drawLayer = createGraphics(width, height);
  drawLayer.colorMode(HSB, 360, 100, 100, 100);

  // シェーダーを作成
  noiseShader = createShader(
    // vertex shader
    `
    attribute vec3 aPosition;
    attribute vec2 aTexCoord;
    varying vec2 vTexCoord;
    void main() {
      vTexCoord = aTexCoord;
      vec4 positionVec4 = vec4(aPosition, 1.0);
      positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
      gl_Position = positionVec4;
    }
    `,
    // fragment shader
    shader1.fs
  );

  noLoop();
}

function draw() {
  // オフスクリーンバッファに描画
  drawLayer.background(20);
  grid(gridNum);

  // シェーダーを適用
  shader(noiseShader);
  noiseShader.setUniform("u_tex", drawLayer);
  noiseShader.setUniform("u_time", time);

  rect(0, 0, width, height);

  time += 0.1;
  noLoop();
}

// 各円の中に三角形を充填する関数
function fillCircleWithTriangles(centerX, centerY, radius) {
  let triangles = [];

  for (let i = 0; i < numTrianglesPerCircle; i++) {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      // 円の中心からランダムな距離と角度
      let angle = random(TWO_PI);
      let distance = random(radius * 0.85);
      let x = centerX + cos(angle) * distance;
      let y = centerY + sin(angle) * distance;

      // 三角形のサイズと回転
      let size = random(8, 20);
      let rotation = random(TWO_PI);

      // 色相をランダムに
      let hue = random(360);
      let saturation = random(60, 100);
      let brightness = random(70, 100);

      // 三角形の頂点を計算
      let vertices = [];
      for (let j = 0; j < 3; j++) {
        let vertexAngle = rotation + (TWO_PI / 3) * j;
        let vx = x + cos(vertexAngle) * size;
        let vy = y + sin(vertexAngle) * size;
        vertices.push({ x: vx, y: vy });
      }

      // すべての頂点が円の中にあるかチェック
      let allInsideCircle = true;
      for (let vertex of vertices) {
        let distFromCenter = dist(vertex.x, vertex.y, centerX, centerY);
        if (distFromCenter > radius) {
          allInsideCircle = false;
          break;
        }
      }

      // 他の三角形と重なっていないかチェック
      let overlapping = false;
      if (allInsideCircle) {
        for (let other of triangles) {
          let d = dist(x, y, other.x, other.y);
          let minDist = size + other.size + minDistance;
          if (d < minDist) {
            overlapping = true;
            break;
          }
        }
      }

      if (allInsideCircle && !overlapping) {
        triangles.push({
          x: x,
          y: y,
          size: size,
          rotation: rotation,
          hue: hue,
          saturation: saturation,
          brightness: brightness,
          vertices: vertices,
        });
        placed = true;
      }

      attempts++;
    }
  }

  // 三角形をオフスクリーンバッファに描画
  for (let tri of triangles) {
    // 塗りつぶし
    drawLayer.fill(tri.hue, tri.saturation, tri.brightness, 80);
    drawLayer.noStroke();

    drawLayer.triangle(
      tri.vertices[0].x,
      tri.vertices[0].y,
      tri.vertices[1].x,
      tri.vertices[1].y,
      tri.vertices[2].x,
      tri.vertices[2].y
    );

    // エッジを描画
    drawLayer.stroke(tri.hue, tri.saturation, tri.brightness - 20, 100);
    drawLayer.strokeWeight(1);
    drawLayer.noFill();

    drawLayer.triangle(
      tri.vertices[0].x,
      tri.vertices[0].y,
      tri.vertices[1].x,
      tri.vertices[1].y,
      tri.vertices[2].x,
      tri.vertices[2].y
    );
  }
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("triangle-circle-grid", "png");
  }
  if (key === "r") {
    redraw();
  }
}

const grid = (num) => {
  const n1 = num + 1;

  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;

  const nw = width / n1;
  const nh = height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);

      // 円の中心と半径を計算
      const centerX = x + nw / 2;
      const centerY = y + nh / 2;
      const radius = nw / 2;

      // 円の枠を描画
      drawLayer.noFill();
      drawLayer.stroke(255, 50);
      drawLayer.strokeWeight(1.5);
      //   drawLayer.circle(centerX, centerY, radius * 2);

      // 円の中に三角形を充填
      fillCircleWithTriangles(centerX, centerY, radius);
    }
  }
};

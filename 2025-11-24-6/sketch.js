// グリッド模様 + GLSL歪み効果

let gridSize = 8; // グリッドの分割数
let cellSize; // 各セルのサイズ
let patternLayer; // 模様を描画するレイヤー
let distortShader; // 歪みシェーダー

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");

  // セルサイズを計算
  cellSize = width / gridSize;

  // 模様を描画するレイヤーを作成
  patternLayer = createGraphics(800, 800);
  patternLayer.rectMode(CENTER);

  // 歪みシェーダーを作成
  distortShader = createShader(vertexShaderCode(), fragmentShaderCode());

  // 正投影カメラに設定
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
}

function draw() {
  // 模様レイヤーに描画
  patternLayer.background(240);
  patternLayer.push();
  patternLayer.translate(width / 2, height / 2);

  // グリッドを中心から描画
  let halfGrid = gridSize / 2;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = (i - halfGrid) * cellSize;
      let y = (j - halfGrid) * cellSize;

      // セルの位置に基づいて模様を描画
      drawPattern(x, y, cellSize, i, j);
    }
  }

  patternLayer.pop();

  // シェーダーを適用して描画
  background(240);
  shader(distortShader);

  // シェーダーにテクスチャと時間を渡す
  distortShader.setUniform("u_texture", patternLayer);
  distortShader.setUniform("u_resolution", [width, height]);
  distortShader.setUniform("u_time", millis() / 1000.0);

  // 全画面の矩形を描画（WEBGLモードでは2倍のサイズが必要）
  noStroke();
  plane(width, height);
}

// 各セルに模様を描画する関数
function drawPattern(x, y, size, i, j) {
  patternLayer.push();
  patternLayer.translate(x + size / 2, y + size / 2);

  // 市松模様の色分け
  if ((i + j) % 2 === 0) {
    patternLayer.fill(100, 150, 200);
  } else {
    patternLayer.fill(200, 100, 150);
  }

  patternLayer.noStroke();
  patternLayer.rect(0, 0, size, size);

  // 中心に四角形を描画
  patternLayer.fill(255);
  let circleSize = size * 0.4;
  patternLayer.square(0, 0, circleSize);

  // 四隅に小さな四角形を描画
  patternLayer.fill(50);
  let cornerSize = size * 0.15;
  let offset = size * 0.3;

  patternLayer.square(-offset, -offset, cornerSize);
  patternLayer.square(offset, -offset, cornerSize);
  patternLayer.square(-offset, offset, cornerSize);
  patternLayer.square(offset, offset, cornerSize);

  patternLayer.pop();
}

// 頂点シェーダー
function vertexShaderCode() {
  return `
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
}

// フラグメントシェーダー（歪み効果）
function fragmentShaderCode() {
  return `
    precision mediump float;
    
    varying vec2 vTexCoord;
    
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_time;
    
    void main() {
      vec2 uv = vTexCoord;
      
      // 波状の歪み効果
      float distortAmount = 0.05;
      float freq = 5.0;
      
      // 中心からの距離
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(uv, center);
      
      // 時間とともに変化する波
      float wave = sin(dist * freq * 6.28318 - u_time * 2.0) * distortAmount;
      
      // UV座標を歪ませる
      vec2 distortedUV = uv + vec2(
        wave * cos(u_time),
        wave * sin(u_time)
      );
      
      // 歪んだ座標でテクスチャをサンプリング
      vec4 color = texture2D(u_texture, distortedUV);
      
      gl_FragColor = color;
    }
  `;
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("grid-pattern", "png");
  }
}

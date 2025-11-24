// グリッド模様 + GLSL歪み効果

let gridSize = 8; // グリッドの分割数
let cellSize; // 各セルのサイズ
let patternLayer; // 模様を描画するレイヤー
let layer1; // シェーダー適用後のレイヤー
let layer2; // 立方体レイヤー
let layer2Distorted; // 立方体の歪みシェーダー適用後のレイヤー
let distortShader; // 歪みシェーダー
let distortShader2; // 立方体用歪みシェーダー

// 立方体のアニメーションパラメータ
let cubeAnim = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  scale: 1,
  posX: 0,
  posY: 0,
};

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent("canvas-container");

  // セルサイズを計算
  cellSize = width / gridSize;

  // 模様を描画するレイヤーを作成
  patternLayer = createGraphics(800, 800);
  patternLayer.rectMode(CENTER);

  // シェーダー適用用のWEBGLレイヤーを作成
  layer1 = createGraphics(800, 800, WEBGL);

  // 立方体用のWEBGLレイヤーを作成
  layer2 = createGraphics(800, 800, WEBGL);

  // 立方体の歪みシェーダー適用後のレイヤーを作成
  layer2Distorted = createGraphics(800, 800, WEBGL);

  // 歪みシェーダーを作成
  distortShader = layer1.createShader(vertexShaderCode(), fragmentShaderCode());
  distortShader2 = layer2Distorted.createShader(
    vertexShaderCode(),
    fragmentShaderCode()
  );

  // GSAPで立方体のアニメーション設定
  setupCubeAnimation();
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

  // layer1にシェーダーを適用して描画
  layer1.shader(distortShader);

  // シェーダーにテクスチャと時間を渡す
  distortShader.setUniform("u_texture", patternLayer);
  distortShader.setUniform("u_resolution", [width, height]);
  distortShader.setUniform("u_time", millis() / 1000.0);

  // layer1に全画面描画
  layer1.noStroke();
  layer1.plane(width, height);

  // layer2に立方体を描画
  updateLayer2();

  // layer2にシェーダーを適用してlayer2Distortedに描画
  layer2Distorted.clear(); // 透明な背景でクリア
  layer2Distorted.shader(distortShader2);
  distortShader2.setUniform("u_texture", layer2);
  distortShader2.setUniform("u_resolution", [width, height]);
  distortShader2.setUniform("u_time", millis() / 1000.0);
  layer2Distorted.noStroke();
  layer2Distorted.plane(width, height);

  // メインキャンバスにレイヤーを合成
  background(240);
  image(layer1, 0, 0);
  image(layer2Distorted, 0, 0);
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

// layer2に立方体を描画
function updateLayer2() {
  layer2.clear(); // 透明な背景でクリア

  layer2.push();
  layer2.translate(cubeAnim.posX, cubeAnim.posY, 0);
  layer2.rotateX(cubeAnim.rotationX);
  layer2.rotateY(cubeAnim.rotationY);
  layer2.rotateZ(cubeAnim.rotationZ);
  layer2.scale(cubeAnim.scale);

  // 立方体の描画
  layer2.fill(255, 100, 150, 200);
  layer2.noStroke();
  layer2.box(150);

  layer2.pop();
}

// GSAPで立方体のアニメーション設定
function setupCubeAnimation() {
  // 回転アニメーション
  gsap.to(cubeAnim, {
    rotationX: Math.PI * 2,
    rotationY: Math.PI * 2,
    rotationZ: Math.PI * 2,
    duration: 8,
    repeat: -1,
    ease: "none",
  });

  // スケールアニメーション
  gsap.to(cubeAnim, {
    scale: 1.5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
  });

  // 位置アニメーション（8の字）
  const tl = gsap.timeline({ repeat: -1 });
  tl.to(cubeAnim, {
    posX: 150,
    posY: -100,
    duration: 2,
    ease: "sine.inOut",
  })
    .to(cubeAnim, {
      posX: 0,
      posY: 0,
      duration: 2,
      ease: "sine.inOut",
    })
    .to(cubeAnim, {
      posX: -150,
      posY: 100,
      duration: 2,
      ease: "sine.inOut",
    })
    .to(cubeAnim, {
      posX: 0,
      posY: 0,
      duration: 2,
      ease: "sine.inOut",
    });
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

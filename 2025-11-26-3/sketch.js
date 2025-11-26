// 曲線に沿ってグラデーションさせた円を配置

let curves = []; // 複数の曲線を格納
let numCurves = 100; // 曲線の数
let numCircles = 200; // 各曲線の円の数
let noiseScale = 0.005; // ノイズのスケール

// GLSL用の変数
let drawLayer; // 曲線を描画するレイヤー
let grainShader; // ガサガサシェーダー

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");

  // 2D描画用のレイヤーを作成
  drawLayer = createGraphics(800, 800);
  drawLayer.noStroke();

  // ガサガサシェーダーを作成
  grainShader = createShader(vertexShader(), fragmentShader());

  // 100本の曲線を生成
  for (let curveIndex = 0; curveIndex < numCurves; curveIndex++) {
    let circles = [];

    let colors = [
      "#E2852E",
      "#F5C857",
      "#FFEE91",
      "#ABE0F0",
      "#FF5555",
      "#FF937E",
      "#C1E59F",
      "#A3D78A",
    ];

    // ランダムな色を生成
    let startColor = color(random(colors));
    let endColor = color(random(colors));

    // 曲線の形状タイプをランダムに選択
    let curveType = floor(random(3)); // 0: 円形, 1: 波形, 2: らせん
    let noiseOffsetX = random(1000);
    let noiseOffsetY = random(1000);

    // キャンバス外も含めた範囲でランダムに配置
    let centerX = random(-200, 1000);
    let centerY = random(-200, 1000);
    let radius = random(100, 400);

    // 曲線に沿って円を密に配置
    for (let i = 0; i < numCircles; i++) {
      let t = i / numCircles; // 0〜1の範囲
      let angle = t * TWO_PI;
      let x, y;

      if (curveType === 0) {
        // 円形の曲線
        x = centerX + cos(angle) * radius;
        y = centerY + sin(angle) * radius;
      } else if (curveType === 1) {
        // くねくねした波形（キャンバス外も含む）
        let noiseX = noise(noiseOffsetX + i * noiseScale);
        let noiseY = noise(noiseOffsetY + i * noiseScale);
        x = map(t, 0, 1, -200, 1000);
        y = map(noiseY, 0, 1, -200, 1000);
      } else {
        // らせん形
        let spiralRadius = radius * t;
        x = centerX + cos(angle * 3) * spiralRadius;
        y = centerY + sin(angle * 3) * spiralRadius;
      }

      // 真ん中ほど大きく、端っこほど小さくするサイズ計算
      let sizeScale = 1.0 - abs(t - 0.5) * 2;
      let baseSize = map(sizeScale, 0, 1, 3, 12);
      let randomOffset = random(-2, 2);

      circles.push({
        x: x,
        y: y,
        t: t,
        size: baseSize + randomOffset,
        startColor: startColor,
        endColor: endColor,
      });
    }

    curves.push(circles);
  }
}

function draw() {
  // drawLayerに曲線を描画
  drawLayer.background(20);

  for (let circles of curves) {
    for (let circle of circles) {
      // 各円固有の開始色から終了色へのグラデーション
      let gradientColor = lerpColor(
        circle.startColor,
        circle.endColor,
        circle.t
      );

      drawLayer.fill(gradientColor);
      drawLayer.ellipse(circle.x, circle.y, circle.size, circle.size);
    }
  }

  // シェーダーを適用
  shader(grainShader);
  grainShader.setUniform("u_texture", drawLayer);
  grainShader.setUniform("u_resolution", [width, height]);
  grainShader.setUniform("u_time", millis() / 1000.0);

  // 全画面に描画
  noStroke();
  plane(width, height);
  noLoop();
}

// 頂点シェーダー
function vertexShader() {
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

// フラグメントシェーダー（波 + ガサガサエフェクト）
function fragmentShader() {
  return `
    precision mediump float;
    varying vec2 vTexCoord;
    
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_time;
    
    // ランダムノイズ関数
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
      vec2 uv = vTexCoord;
      
      // 波の効果を追加
      float wave1 = sin(uv.x * 10.0 + u_time * 2.0) * 0.01;
      float wave2 = sin(uv.y * 15.0 - u_time * 1.5) * 0.01;
      float wave3 = sin((uv.x + uv.y) * 8.0 + u_time) * 0.008;
      
      // UV座標を波で歪ませる
      vec2 distortedUV = uv + vec2(wave1 + wave3, wave2 + wave3);
      
      // 歪んだUV座標でテクスチャを取得
      vec4 color = texture2D(u_texture, distortedUV);
      
      // ガサガサしたノイズを生成
      float noise = random(uv * 100.0 + u_time * 0.1);
      float grain = (noise - 0.5) * 0.15; // ノイズの強度
      
      // 色にノイズを加える
      color.rgb += grain;
      
      gl_FragColor = color;
    }
  `;
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("gradient-curve", "png");
  }
}

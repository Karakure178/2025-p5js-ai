// GLSLで円と四角形の重なり部分をモザイク調にする

let theShader;
let circleLayer; // 円レイヤー
let rectLayer; // 四角形用の別レイヤー
let rectangles = []; // 四角形のデータ

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");

  // シェーダーを作成
  theShader = createShader(vertShader, fragShader);

  // 円レイヤーを作成（シンプルな単色の円）
  circleLayer = createGraphics(width, height);
  circleLayer.background(255); // 白背景
  circleLayer.fill(100, 180, 255); // 青色
  circleLayer.noStroke();
  circleLayer.ellipse(width / 2, height / 2, 400, 400);

  // 別レイヤーを作成
  rectLayer = createGraphics(width, height);
  rectLayer.background(255); // 白背景
  rectLayer.clear();

  // ランダムな四角形を生成（美しい配色）
  const colorPalette = [
    [255, 107, 107], // コーラルレッド
    [255, 159, 64], // オレンジ
    [255, 205, 86], // イエロー
    [75, 192, 192], // ティール
    [54, 162, 235], // ブルー
    [153, 102, 255], // パープル
    [255, 99, 132], // ピンク
  ];

  for (let i = 0; i < 15; i++) {
    let col = random(colorPalette);
    rectangles.push({
      x: random(width),
      y: random(height),
      w: random(50, 150),
      h: random(50, 150),
      r: col[0],
      g: col[1],
      b: col[2],
      alpha: 255,
      rotation: random(TWO_PI),
    });
  }

  // 四角形を描画
  drawRectangles();

  noStroke();
}

function draw() {
  shader(theShader);
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", frameCount * 0.01);
  theShader.setUniform("u_circleLayer", circleLayer);
  theShader.setUniform("u_rectLayer", rectLayer);
  rect(-width / 2, -height / 2, width, height);
}

// 四角形を別レイヤーに描画
function drawRectangles() {
  rectLayer.clear();

  for (let rect of rectangles) {
    rectLayer.push();
    rectLayer.translate(rect.x, rect.y);
    rectLayer.rotate(rect.rotation);
    rectLayer.fill(rect.r, rect.g, rect.b, rect.alpha);
    rectLayer.noStroke();
    rectLayer.rectMode(CENTER);
    rectLayer.rect(0, 0, rect.w, rect.h);
    rectLayer.pop();
  }
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("heart-grid", "png");
  }
  if (key === "r") {
    redraw();
  }
}

// 頂点シェーダー
const vertShader = `
  precision highp float;
  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;

  void main() {
    vTexCoord = aTexCoord;
    vec4 positionVec4 = vec4(aPosition, 1.0);
    positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
    gl_Position = positionVec4;
  }
`;

// フラグメントシェーダー（重なり部分をモザイク、それ以外をボロノイ図で歪ませる）
const fragShader = `
  precision highp float;
  varying vec2 vTexCoord;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform sampler2D u_circleLayer;
  uniform sampler2D u_rectLayer;

  void main() {
    vec2 st = vTexCoord;
    st.y = 1.0 - st.y; // Y座標を反転
    
    // 円レイヤーと四角形レイヤーのサンプリング
    vec4 circleColor = texture2D(u_circleLayer, st);
    vec4 rectColor = texture2D(u_rectLayer, st);
    
    // 重なり判定（両方のアルファ値が0より大きい）
    float isOverlap = step(0.1, circleColor.a) * step(0.1, rectColor.a);
    
    // モザイクサイズ
    float mosaicSize = 0.015;
    
    // 重なり部分：モザイク効果を適用
    vec2 mosaicUV = floor(st / mosaicSize) * mosaicSize;
    vec4 mosaicCircleColor = texture2D(u_circleLayer, mosaicUV);
    vec4 mosaicRectColor = texture2D(u_rectLayer, mosaicUV);
    
    // 白背景にアルファブレンド
    vec3 mosaicCircle = mix(vec3(1.0), mosaicCircleColor.rgb, mosaicCircleColor.a);
    vec3 mosaicRect = mix(vec3(1.0), mosaicRectColor.rgb, mosaicRectColor.a);
    vec3 overlapColor = mix(mosaicCircle, mosaicRect, 0.5);
    
    // それ以外：通常の合成
    vec3 bgColor = vec3(1.0, 1.0, 1.0); // 白背景
    vec3 normalColor = mix(bgColor, circleColor.rgb, circleColor.a);
    normalColor = mix(normalColor, rectColor.rgb, rectColor.a * 0.7);
    
    // 最終的な色を合成
    vec3 finalColor = mix(normalColor, overlapColor, isOverlap);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

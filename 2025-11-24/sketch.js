// レイヤー合成とGLSLシェーダー

let layer1; // 四角形のレイヤー
let layer2; // 円のレイヤー
let compositeShader; // 合成用シェーダー
let circles = []; // サークルパッキング用の円配列

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  pixelDensity(1);

  // シェーダーを作成
  compositeShader = createShader(vertexShaderCode(), fragmentShaderCode());

  // レイヤー1: 四角形を描画
  layer1 = createGraphics(800, 800);
  layer1.background(0, 0);
  layer1.fill(255);
  layer1.noStroke();
  layer1.rectMode(CENTER);
  layer1.push();
  layer1.translate(400, 400);
  layer1.rect(0, 0, 300, 300);
  layer1.pop();

  // サークルパッキングアルゴリズムで円を生成
  generateCirclePacking();

  // レイヤー2: 円を描画
  layer2 = createGraphics(800, 800);
  layer2.background(0, 0);
  layer2.fill(255);
  layer2.noStroke();
  for (let circle of circles) {
    layer2.ellipse(circle.x, circle.y, circle.r * 2);
  }
}

function draw() {
  background(30);

  // シェーダーを使用して2つのレイヤーを合成
  shader(compositeShader);

  // シェーダーにテクスチャを渡す
  compositeShader.setUniform("layer1", layer1);
  compositeShader.setUniform("layer2", layer2);
  compositeShader.setUniform("u_resolution", [width, height]);
  compositeShader.setUniform("u_time", millis() / 1000.0);

  // 全画面の矩形を描画
  noStroke();
  rect(-width / 2, -height / 2, width, height);
}

// サークルパッキングアルゴリズム
function generateCirclePacking() {
  circles = [];
  const maxAttempts = 1000;
  const minRadius = 10;
  const maxRadius = 60;

  for (let i = 0; i < maxAttempts; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(minRadius, maxRadius);

    let valid = true;

    // 既存の円と重ならないかチェック
    for (let other of circles) {
      let d = dist(x, y, other.x, other.y);
      if (d < r + other.r + 5) {
        // 5pxの余白
        valid = false;
        break;
      }
    }

    // キャンバスの端からはみ出さないかチェック
    if (x - r < 0 || x + r > width || y - r < 0 || y + r > height) {
      valid = false;
    }

    if (valid) {
      circles.push({ x, y, r });
    }
  }
}

// 頂点シェーダー
function vertexShaderCode() {
  return `
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
}

// フラグメントシェーダー
function fragmentShaderCode() {
  return `
    precision mediump float;
    
    varying vec2 vTexCoord;
    
    uniform sampler2D layer1;
    uniform sampler2D layer2;
    uniform vec2 u_resolution;
    uniform float u_time;
    
    void main() {
      vec2 uv = vTexCoord;
      
      // 各レイヤーの色を取得
      vec4 color1 = texture2D(layer1, uv);
      vec4 color2 = texture2D(layer2, uv);
      
      // アルファ値から重なりを判定
      float overlap = color1.a * color2.a;
      
      // 重なっている部分に色を付ける
      vec3 overlapColor = vec3(0.0);
      if (overlap > 0.5) {
        // 虹色のグラデーション（時間で変化）
        float hue = uv.x + uv.y + sin(u_time) * 0.5;
        overlapColor = vec3(
          0.5 + 0.5 * sin(hue * 6.28318 + u_time),
          0.5 + 0.5 * sin(hue * 6.28318 + u_time + 2.094),
          0.5 + 0.5 * sin(hue * 6.28318 + u_time + 4.189)
        );
      } else {
        // 重なっていない部分は白
        overlapColor = vec3(color1.rgb + color2.rgb);
      }
      
      float alpha = max(color1.a, color2.a);
      gl_FragColor = vec4(overlapColor, alpha);
    }
  `;
}

// レイヤー合成とGLSLシェーダー

let layer1; // 四角形のレイヤー
let layer2; // 円のレイヤー
let compositeShader; // 合成用シェーダー
let circles = []; // サークルパッキング用の円配列
let circles2 = []; // サークルパッキング用の円配列

// GSAP用のアニメーションパラメータ（複数の四角形）
let rects = [];

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  pixelDensity(1);

  // シェーダーを作成
  compositeShader = createShader(vertexShaderCode(), fragmentShaderCode());

  // 複数の四角形を生成
  const rectCount = 5;
  for (let i = 0; i < rectCount; i++) {
    rects.push({
      rotation: random(0, 360),
      scale: random(0.5, 1.5),
      x: random(200, 600),
      y: random(200, 600),
      size: random(100, 300),
    });
  }

  circles = generateCirclePacking(1000, 10, 60, 5);

  // レイヤー1とレイヤー2を作成
  layer1 = createGraphics(800, 800);
  layer2 = createGraphics(800, 800);

  // サークルパッキングアルゴリズムで円を生成
  circles2 = generateCirclePacking(1000, 10, 60, 5);

  // 各円にアニメーションパラメータを追加
  circles2.forEach((circle) => {
    circle.animScale = 1;
    circle.animRotation = 0;
    circle.animOffsetX = 0;
    circle.animOffsetY = 0;
  });

  // レイヤー2を作成
  layer2 = createGraphics(800, 800);

  // GSAPでかっこいいアニメーションを設定
  setupAnimation();
}

function setupAnimation() {
  // 各四角形にランダムなアニメーションを適用
  rects.forEach((rect, index) => {
    const delay = random(0, 1);

    // 初期回転角度とサイズを保存
    const initialRotation = rect.rotation;
    const initialSize = rect.size;
    const initialScale = rect.scale;
    const targetScale1 = random(1.2, 1.8);
    const targetScale2 = random(0.3, 0.7);
    const targetSizeMultiplier = random(1.3, 1.7);

    // タイムラインを作成
    const tl = gsap.timeline({ repeat: -1, delay: delay });

    // 回転とスケールのアニメーション（相対的な値を使用）
    tl.to(rect, {
      rotation: "+=360",
      scale: targetScale1,
      size: initialSize,
      duration: random(1.5, 2.5),
      ease: "power2.inOut",
    })
      .to(rect, {
        scale: targetScale2,
        size: initialSize,
        duration: random(1, 2),
        ease: "elastic.out(1, 0.5)",
      })
      .to(rect, {
        rotation: "+=360",
        scale: initialScale,
        size: initialSize,
        duration: random(1.5, 2.5),
        ease: "back.inOut(1.7)",
      })
      .to(rect, {
        size: initialSize * targetSizeMultiplier,
        scale: initialScale,
        duration: random(1, 2),
        ease: "power3.inOut",
      })
      .to(rect, {
        size: initialSize,
        scale: initialScale,
        rotation: rect.rotation,
        duration: random(1, 2),
        ease: "bounce.out",
      });

    // 位置の別アニメーション
    gsap
      .timeline({ repeat: -1, yoyo: true, delay: delay })
      .to(rect, {
        x: random(150, 650),
        y: random(150, 650),
        duration: random(2, 4),
        ease: "sine.inOut",
      })
      .to(rect, {
        x: random(150, 650),
        y: random(150, 650),
        duration: random(2, 4),
        ease: "sine.inOut",
      });
  });

  // 各円にランダムなアニメーションを適用
  circles2.forEach((circle, index) => {
    const delay = random(0, 2);
    const duration = random(2, 4);

    // スケールアニメーション
    gsap.to(circle, {
      animScale: random(0.5, 1.5),
      duration: duration,
      delay: delay,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // 回転アニメーション
    gsap.to(circle, {
      animRotation: random(-180, 180),
      duration: random(3, 6),
      delay: delay,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // 位置オフセットアニメーション（小さな揺れ）
    const offsetRange = circle.r * 0.3;
    gsap.to(circle, {
      animOffsetX: random(-offsetRange, offsetRange),
      animOffsetY: random(-offsetRange, offsetRange),
      duration: random(2, 5),
      delay: delay,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}

function draw() {
  background(30);

  // レイヤー1とレイヤー2を毎フレーム更新（アニメーション適用）
  updateLayer1();
  updateLayer2();

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

// レイヤー1を更新する関数（GSAPアニメーション適用 - 複数の四角形）
function updateLayer1() {
  layer1.clear();
  layer1.background(0, 0);
  layer1.fill(255);
  layer1.noStroke();

  for (let rect of rects) {
    layer1.push();
    layer1.translate(rect.x, rect.y);
    layer1.rotate(radians(rect.rotation));
    layer1.scale(rect.scale);
    layer1.rectMode(CENTER);
    layer1.rect(0, 0, rect.size, rect.size);
    layer1.pop();
  }
}

// レイヤー2を更新する関数（サークルパッキングのアニメーション）
function updateLayer2() {
  layer2.clear();
  layer2.background(0, 0);
  layer2.fill(255);
  layer2.noStroke();

  for (let circle of circles2) {
    layer2.push();
    layer2.translate(
      circle.x + circle.animOffsetX,
      circle.y + circle.animOffsetY
    );
    layer2.rotate(radians(circle.animRotation));
    layer2.scale(circle.animScale);
    layer2.ellipse(0, 0, circle.r * 2, circle.r * 2);
    layer2.pop();
  }
}

keyPressed = () => {
  if (key === "s") {
    //saveCanvas(canvas, "canvas", "png");
    saveGif("canvsas", 2);
  }
};

// サークルパッキングアルゴリズム
function generateCirclePacking(
  maxAttempts = 1000,
  minRadius = 10,
  maxRadius = 60,
  padding = 5
) {
  let circles = [];

  for (let i = 0; i < maxAttempts; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(minRadius, maxRadius);

    let valid = true;

    // 既存の円と重ならないかチェック
    for (let other of circles) {
      let d = dist(x, y, other.x, other.y);
      if (d < r + other.r + padding) {
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
  return circles;
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

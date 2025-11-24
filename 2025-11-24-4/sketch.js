// レイヤー合成とGLSLシェーダー

let layer1; // ライフゲームのレイヤー
let layer2; // 円のレイヤー
let compositeShader; // 合成用シェーダー
let circles2 = []; // サークルパッキング用の円配列

// ライフゲーム用の変数
let grid = [];
let cols, rows;
let cellSize = 10;
let frameCounter = 0;
let updateInterval = 5; // 5フレームごとに更新

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  pixelDensity(1);

  // シェーダーを作成
  compositeShader = createShader(vertexShaderCode(), fragmentShaderCode());

  // ライフゲームのグリッドを初期化
  cols = floor(800 / cellSize);
  rows = floor(800 / cellSize);
  grid = createGrid(cols, rows);

  // ランダムに初期セルを配置
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = random() > 0.7 ? 1 : 0;
    }
  }

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

  // 円のアニメーションを設定
  setupCircleAnimation();
}

function setupCircleAnimation() {
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

// ライフゲーム用のグリッドを作成
function createGrid(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows);
    for (let j = 0; j < rows; j++) {
      arr[i][j] = 0;
    }
  }
  return arr;
}

// 隣接する生きているセルの数を数える
function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

// 次の世代を計算
function nextGeneration() {
  let next = createGrid(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];
      let neighbors = countNeighbors(grid, i, j);

      // Conway's Game of Lifeのルール
      if (state === 0 && neighbors === 3) {
        next[i][j] = 1; // 誕生
      } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        next[i][j] = 0; // 死亡
      } else {
        next[i][j] = state; // 現状維持
      }
    }
  }

  grid = next;
}

function draw() {
  background(30);

  // ライフゲームを更新（数フレームごと）
  frameCounter++;
  if (frameCounter >= updateInterval) {
    nextGeneration();
    frameCounter = 0;
  }

  // レイヤー1とレイヤー2を毎フレーム更新
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

// レイヤー1を更新する関数（ライフゲーム）
function updateLayer1() {
  layer1.clear();
  layer1.background(0, 0);
  layer1.fill(255);
  layer1.noStroke();

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] === 1) {
        layer1.rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
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
      
      // 重なっている部分だけ表示、それ以外は透明
      vec3 overlapColor = vec3(0.0);
      float alpha = 0.0;
      
      if (overlap > 0.5) {
        // 虹色のグラデーション（時間で変化）
        float hue = uv.x + uv.y + sin(u_time) * 0.5;
        overlapColor = vec3(
          0.5 + 0.5 * sin(hue * 6.28318 + u_time),
          0.5 + 0.5 * sin(hue * 6.28318 + u_time + 2.094),
          0.5 + 0.5 * sin(hue * 6.28318 + u_time + 4.189)
        );
        alpha = 1.0;
      }
      
      gl_FragColor = vec4(overlapColor, alpha);
    }
  `;
}

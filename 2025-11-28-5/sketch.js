const GRID_SIZE = 7; // 7x7 マス
const CELL_SIZE = 20; // 1マスの大きさ
const TILE_COLS = 4; // タイルの列数（横にいくつ並べるか）
const TILE_ROWS = 4; // タイルの行数（縦にいくつ並べるか）

let pattern;
let myShader; // FBMシェーダー
let pg; // パターン描画用のバッファ
let needsUpdate = true; // バッファを描き直す必要があるかどうか

// 頂点シェーダー（標準的なパススルー）
const vertShader = `
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

// FBMで歪ませるフラグメントシェーダー
const fragShader = `
precision mediump float;

varying vec2 vTexCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;

// ランダム生成
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

// スムーズノイズ
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(rand(i + vec2(0.0, 0.0)), rand(i + vec2(1.0, 0.0)), u.x),
    mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// FBM（フラクタルブラウン運動）
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.8;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(st * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vTexCoord;

  // アスペクト比を補正
  vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 centered = (uv - 0.5) * aspect + 0.5;

  // FBMによる歪みオフセット
  float t = u_time * 0.2;
  float fbmX = fbm(centered * 30.0 + vec2(0.0, t));
  float fbmY = fbm(centered * 30.0 + vec2(5.2, -t));
  vec2 offset = vec2(fbmX, fbmY) - 0.5;

  vec2 warpedUV = uv + offset * 0.08;
  vec4 color = texture2D(u_texture, warpedUV);

  gl_FragColor = color;
}
`;

// ゆめかわパレット（パステル系）
const pastelColors = [
  [255, 204, 229], // pastel pink
  [221, 204, 255], // pastel purple
  [204, 236, 255], // pastel blue
  [204, 255, 236], // pastel mint
  [255, 246, 204], // pastel yellow
];

function setup() {
  const w = GRID_SIZE * CELL_SIZE * TILE_COLS;
  const h = GRID_SIZE * CELL_SIZE * TILE_ROWS;
  createCanvas(w, h, WEBGL);
  pixelDensity(1);

  myShader = createShader(vertShader, fragShader);
  pg = createGraphics(w, h);
  pg.pixelDensity(1);

  pattern = generateCutePattern(GRID_SIZE);
  drawPatternToBuffer();
}

function draw() {
  if (needsUpdate) {
    drawPatternToBuffer();
    needsUpdate = false;
  }

  shader(myShader);
  myShader.setUniform("u_time", millis() / 1000.0);
  myShader.setUniform("u_resolution", [width, height]);
  myShader.setUniform("u_texture", pg);

  noStroke();
  rect(-width / 2, -height / 2, width, height);
}

// バッファにパターンを描画
function drawPatternToBuffer() {
  pg.push();
  pg.background(252, 247, 255);

  for (let ty = 0; ty < TILE_ROWS; ty++) {
    for (let tx = 0; tx < TILE_COLS; tx++) {
      drawPatternTile(
        pg,
        tx * GRID_SIZE * CELL_SIZE,
        ty * GRID_SIZE * CELL_SIZE,
        pattern
      );
    }
  }

  drawGlobalGrid(pg);
  pg.pop();
}

// 左右対称の「かわいい」ランダム 7x7 パターン生成
function generateCutePattern(size = 7) {
  const pat = Array.from({ length: size }, () => Array(size).fill(0));
  const half = Math.ceil(size / 2);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < half; x++) {
      // 1 の出現率を少し下げてドット絵っぽく
      const v = Math.random() < 0.4 ? 1 : 0;
      pat[y][x] = v;
      pat[y][size - 1 - x] = v; // 左右対称
    }
  }
  return pat;
}

// 1タイル分（7x7）を描く
function drawPatternTile(g, offsetX, offsetY, pat) {
  g.noStroke();
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const sx = offsetX + x * CELL_SIZE;
      const sy = offsetY + y * CELL_SIZE;

      if (pat[y][x] === 1) {
        // 1 のところはゆめかわパステル色の丸
        const c = random(pastelColors);
        g.fill(c[0], c[1], c[2]);
        // 少し余白を残した丸にしてふわっと
        const r = CELL_SIZE * 0.8;
        g.ellipse(sx + CELL_SIZE / 2, sy + CELL_SIZE / 2, r, r);
      } else {
        // 0 のところはうっすら背景色寄り
        g.fill(255, 255, 255, 100);
        g.rect(sx, sy, CELL_SIZE, CELL_SIZE);
      }
    }
  }

  // タイルごとに薄い枠線をつけて区切り感
  g.stroke(255, 240);
  g.strokeWeight(1);
  g.noFill();
  g.rect(offsetX, offsetY, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
}

// 画面全体に薄い格子線を引いて「編み図」感を強める
function drawGlobalGrid(g) {
  g.stroke(255, 230);
  g.strokeWeight(1);

  // 縦線
  for (let x = 0; x <= g.width; x += CELL_SIZE) {
    g.line(x, 0, x, g.height);
  }
  // 横線
  for (let y = 0; y <= g.height; y += CELL_SIZE) {
    g.line(0, y, g.width, y);
  }
}

// キーを押すたびに新しいゆめかわパターンを生成
function keyPressed() {
  if (key === "s") {
    saveCanvas("knitting-chart", "png");
  } else if (key === " ") {
    pattern = generateCutePattern(GRID_SIZE);
    needsUpdate = true;
  }
}

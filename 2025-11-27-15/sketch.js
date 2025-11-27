// FBMとボロノイを使用した歪みエフェクト
let myShader;
let canvas;
let pg; // グラフィックスバッファ
let gridSize = 6.0; // グリッドのサイズ

// 5色のカラーパレット（16進数）
const colorPalette = ["#5EABD6", "#FFB4B4", "#E14434", "#FFA673", "#FFD66B"];

// グリッドの各セルに割り当てる色のインデックス
let colorIndices = [];

// 16進数カラーをRGB配列(0.0-1.0)に変換する関数
function hexToRgb(hex) {
  // #を取り除く
  hex = hex.replace("#", "");

  // RGBの値を取得
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return [r, g, b];
}

// 頂点シェーダー
const vertShader = `
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

// フラグメントシェーダー
const fragShader = `
precision mediump float;

varying vec2 vTexCoord;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_gridSize;
uniform vec3 u_colors[25]; // 最大5x5グリッドまで対応
uniform sampler2D u_tex; // グラフィックスバッファのテクスチャ

float pi = 3.14159265358979;

// 2次元ランダム関数
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return 2.0 * fract(sin(st) * 43758.5453123) - 1.0;
}

// ノイズ関数
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float smoothNoise(vec2 p) {
    return noise(p) * 0.5 + 0.5;
}

// フラクタルノイズ（fbm）
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

void main() {
    vec2 st = vTexCoord;
    st.y = 1.0 - st.y;
    
    vec2 uv = st;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // FBMによる歪み
    float fbmValue1 = fbm(uv * 4.0 + u_time * 0.9);
    float fbmValue2 = fbm(uv * 6.0 - u_time * 0.9);
    
    vec2 distortion = vec2(
        fbmValue1 * 0.08,
        fbmValue2 * 0.08
    );
    
    vec2 distortedUV = uv + distortion;
    
    vec3 color = vec3(0.0);
    
    // グリッドを作成（外部から指定）
    float gridSize = u_gridSize;
    vec2 aspectRatio = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 gridUV = distortedUV * aspectRatio * gridSize;
    vec2 gridCell = floor(gridUV);
    vec2 gridLocalUV = fract(gridUV);
    
    // 各グリッドセルの中心からの距離
    vec2 cellCenter = vec2(0.5, 0.5);
    float distToGridCenter = length(gridLocalUV - cellCenter);
    
    // 円の半径（グリッドセル内）
    float circleRadius = 0.35;
    float fbmDistortion = fbmValue1 * 0.03;
    float distortedCircleDist = distToGridCenter + fbmDistortion;
    
    float circleDist = distortedCircleDist / circleRadius;
    float circle = smoothstep(1.0, 0.9, circleDist);
    
    // グリッドセルのインデックスを計算（1次元配列用）
    // グリッドの範囲外の場合は0を使用
    int cellX = int(mod(gridCell.x, gridSize));
    int cellY = int(mod(gridCell.y, gridSize));
    int cellIndex = cellY * int(gridSize) + cellX;
    
    // インデックスが範囲内かチェック
    if (cellIndex < 0 || cellIndex >= 25) {
        cellIndex = 0;
    }
    
    // 円の色（各セルごとに異なる色）
    vec3 circleColor = vec3(1.0);
    
    for (int i = 0; i < 25; i++) {
        if (i == cellIndex) {
            circleColor = u_colors[i];
            break;
        }
    }
    
    // 波状の歪みを追加（参考コードから）
    vec2 distortedSt = st;
    distortedSt.x += 0.08 * cos(st.y * pi * 5.0 + u_time);
    
    // ノイズとのミックス
    vec2 pos = vec2(st * 10.0);
    vec3 noiseColor = vec3(noise(pos) * 0.5 + 0.5);
    vec3 mixedColor = mix(circleColor, noiseColor, cos(st.x * pi * 5.0 + u_time));
    
    // 円を背景に合成
    color = mix(color, mixedColor, circle * 0.95);
    
    // テクスチャを適用（白い部分だけ表示）
    vec4 tex = texture2D(u_tex, distortedSt);
    float mask = tex.r; // 白い円の部分は1.0、黒い部分は0.0
    
        // ドットパターン
        vec2 dotGrid = fract(st * 150.0); // 50x50のグリッド
        vec2 dotCenter = vec2(0.5, 0.5);
        float dotDist = length(dotGrid - dotCenter);
        float dotMask = smoothstep(0.3, 0.25, dotDist);
        
        // ドットマスクを適用
        color = color * dotMask;
    
    // マスクで色を適用
    color = color * mask;
    
    // ノイズ追加
    float whiteNoise = (noise(st * 100.0) * 2.0 - 1.0) * 0.04;
    
    gl_FragColor = vec4(color + whiteNoise, 1.0);
}
`;

const maxCells = 25; // 最大5x5グリッド

function setup() {
  canvas = createCanvas(800, 800, WEBGL);

  // シェーダーを作成
  myShader = createShader(vertShader, fragShader);

  // グリッドの各セルにランダムな色を割り当て
  for (let i = 0; i < maxCells; i++) {
    colorIndices.push(floor(random(colorPalette.length)));
  }

  // グラフィックスバッファを作成（少し遅延させる）
  setTimeout(() => {
    pg = createGraphics(width, height);
    pg.background(0); // 黒背景
    pg.fill(255); // 白い円
    pg.noStroke();
    pg.circle(pg.width / 2, pg.height / 2, 600);
  }, 0);
}

function draw() {
  // pgが作成されていない場合は何もしない
  if (!pg) return;

  // シェーダーを適用
  shader(myShader);

  // ユニフォーム変数を設定
  myShader.setUniform("u_time", -frameCount / 35);
  myShader.setUniform("u_resolution", [width, height]);
  myShader.setUniform("u_gridSize", gridSize);
  myShader.setUniform("u_tex", pg);

  // 各セルの色を配列で送信
  let colors = [];
  for (let i = 0; i < maxCells; i++) {
    const colorIndex = colorIndices[i];
    const rgb = hexToRgb(colorPalette[colorIndex]);
    colors.push(rgb[0], rgb[1], rgb[2]);
  }
  myShader.setUniform("u_colors", colors);

  // 全画面の矩形を描画
  rect(0, 0, width, height);
}

// キーボード入力でキャンバスを保存
function keyPressed() {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
  }
}

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("quarter-donut", "png");
  }
}

// ボロノイ図を使用した歪みエフェクト
let myShader;
let canvas;

const colors = [
  "#5EABD6",
  "#FFB4B4",
  "#E14434",
  "#03A6A1",
  "#FFA673",
  "#FF4F0F",
  "#FFD66B",
];
let colorSelect = [];
let num = 3; // 3x3グリッド
let circleColorHex = "#FFFFFF"; // 円の色（16進数）

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
uniform sampler2D u_tex;
uniform vec3 u_circleColor;

// 2次元ランダム関数
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

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
    
    for (int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

// ボロノイ距離計算
vec3 voronoi(vec2 st, float scale) {
    vec2 i_st = floor(st * scale);
    vec2 f_st = fract(st * scale);
    
    float minDist = 1.0;
    vec2 minCell = vec2(0.0);
    
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5 * sin(u_time * 0.2 + 6.2831 * point);
            
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            
            if (dist < minDist) {
                minDist = dist;
                minCell = i_st + neighbor;
            }
        }
    }
    
    return vec3(minDist, minCell);
}

void main() {
    vec2 st = vTexCoord;
    st.y = 1.0 - st.y;
    
    vec2 uv = st;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // FBMによる歪み
    float fbmValue1 = fbm(uv * 4.0 + u_time * 1.9);
    float fbmValue2 = fbm(uv * 6.0 - u_time * 1.9);
    
    vec2 distortion = vec2(
        fbmValue1 * 0.08,
        fbmValue2 * 0.08
    );
    
    vec2 distortedUV = uv + distortion;
    
    // 中心からの距離
    vec2 center = vec2(0.5 * u_resolution.x / u_resolution.y, 0.5);
    float distToCenter = length(distortedUV - center);
    
    // ボロノイ計算
    vec3 voronoi1 = voronoi(distortedUV, 6.0);
    vec3 voronoi2 = voronoi(distortedUV, 12.0);
    
    vec2 cellId = voronoi1.yz;
    vec3 cellBaseColor = 0.5 + 0.5 * cos(cellId.xyx * vec3(3.1, 5.7, 7.3) + vec3(0.0, 2.0, 4.0));
    
    float dist1 = voronoi1.x;
    float dist2 = voronoi2.x;
    
    float border1 = smoothstep(0.0, 0.01, dist1);
    float border2 = smoothstep(0.0, 0.02, dist2);
    
    float borderPattern = border1 * 0.6 + border2 * 0.4;
    
    vec3 cellColor = mix(vec3(0.0), cellBaseColor * 1.5, borderPattern);
    cellColor += (1.0 - border1) * cellBaseColor * 0.4;
    
    vec3 color = vec3(0.0);
    
    // 中央の円（FBMで歪ませる）
    float circleRadius = 0.25;
    float fbmDistortion = fbmValue1 * 0.05;
    float distortedCenterDist = distToCenter + fbmDistortion;
    
    float circleDist = distortedCenterDist / circleRadius;
    float circle = smoothstep(1.0, 0.85, circleDist);
    
    // 円の中心座標
    vec2 centerPos = vec2(0.5 * u_resolution.x / u_resolution.y, 0.5);
    vec2 circleUV = (distortedUV - centerPos) / circleRadius;
    
    // 円の色（外部から指定）
    vec3 circleColor = u_circleColor;
    
    color = mix(color, circleColor, circle * 0.95);
    
    // ノイズ追加
    float whiteNoise = (noise(st * 100.0) * 2.0 - 1.0) * 0.04;
    
    gl_FragColor = vec4(color + whiteNoise, 1.0);
}
`;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);

  // カラー配列を初期化
  for (let i = 0; i < num; i++) {
    colorSelect.push([]);
    for (let j = 0; j < num; j++) {
      colorSelect[i].push(random(colors));
    }
  }

  // シェーダーを作成
  myShader = createShader(vertShader, fragShader);
}

function draw() {
  // シェーダーを適用
  shader(myShader);

  // ユニフォーム変数を設定
  myShader.setUniform("u_time", millis() / 1000.0);
  myShader.setUniform("u_resolution", [width, height]);

  // 16進数の色をRGB配列に変換してシェーダーに渡す
  myShader.setUniform("u_circleColor", hexToRgb(circleColorHex));

  // 全画面の矩形を描画
  rect(0, 0, width, height);
}

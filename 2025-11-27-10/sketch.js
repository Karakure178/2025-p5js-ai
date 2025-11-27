// GLSLのボロノイ図で円を歪ませる

let theShader;

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");

  // シェーダーを作成
  theShader = createShader(vertShader, fragShader);

  noStroke();
}

function draw() {
  // シェーダーを適用
  shader(theShader);

  // ユニフォーム変数を設定
  theShader.setUniform("u_resolution", [width, height]);
  theShader.setUniform("u_time", frameCount * 0.01);

  // 全画面に描画
  rect(-width / 2, -height / 2, width, height);
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

// フラグメントシェーダー（ボロノイ図で歪み）
const fragShader = `
  precision highp float;
  varying vec2 vTexCoord;
  uniform vec2 u_resolution;
  uniform float u_time;

  // ランダム関数
  vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
  }

  // ボロノイ図の計算
  float voronoi(vec2 st) {
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    
    float min_dist = 1.0;
    
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = random2(i_st + neighbor);
        point = 0.5 + 0.5 * sin(u_time + 6.2831 * point);
        vec2 diff = neighbor + point - f_st;
        float dist = length(diff);
        min_dist = min(min_dist, dist);
      }
    }
    
    return min_dist;
  }

  void main() {
    vec2 st = vTexCoord;
    vec2 uv = st * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // ボロノイ図で歪みを計算
    vec2 voronoi_uv = st * 5.0;
    float voronoi_val = voronoi(voronoi_uv);
    
    // 歪みを適用
    vec2 distorted_uv = uv + voronoi_val * 0.3 * vec2(
      cos(u_time + st.x * 3.14),
      sin(u_time + st.y * 3.14)
    );
    
    // 円を描画
    float dist = length(distorted_uv);
    float circle = smoothstep(0.52, 0.48, dist);
    
    // 色を設定
    vec3 color = mix(
      vec3(0.95, 0.95, 0.95),
      vec3(0.4, 0.6, 1.0),
      circle
    );
    
    // ボロノイ図の模様を追加
    color += voronoi_val * 0.1 * circle;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

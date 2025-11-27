// ボロノイ図を使用した歪みエフェクト
let myShader;

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

// 2次元ランダム関数
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

// ボロノイ距離計算
vec3 voronoi(vec2 st, float scale) {
    vec2 i_st = floor(st * scale);
    vec2 f_st = fract(st * scale);
    
    float minDist = 1.0;
    vec2 minPoint = vec2(0.0);
    
    // 周囲の9つのセルをチェック
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i_st + neighbor);
            
            // 点をアニメーション
            point = 0.5 + 0.5 * sin(u_time * 0.5 + 6.2831 * point);
            
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            
            if (dist < minDist) {
                minDist = dist;
                minPoint = point;
            }
        }
    }
    
    return vec3(minDist, minPoint);
}

void main() {
    vec2 st = vTexCoord;
    st.y = 1.0 - st.y; // Y座標を反転
    
    // アスペクト比の補正
    vec2 uv = st;
    uv.x *= u_resolution.x / u_resolution.y;
    
    // 中心からの距離を計算
    vec2 center = vec2(0.5 * u_resolution.x / u_resolution.y, 0.5);
    float distToCenter = length(uv - center);
    
    // ボロノイ計算
    vec3 voronoi1 = voronoi(uv, 5.0);
    vec3 voronoi2 = voronoi(uv, 8.0);
    
    // ボロノイを使って歪み座標を計算
    vec2 distortion = vec2(
        voronoi1.x * cos(u_time * 0.3),
        voronoi1.x * sin(u_time * 0.3)
    ) * 0.1;
    
    // 歪んだ座標でボロノイを再計算
    vec2 distortedUV = uv + distortion;
    vec3 finalVoronoi = voronoi(distortedUV, 6.0);
    
    // カラーリング
    float dist = finalVoronoi.x;
    
    // セルの境界を強調
    float border = smoothstep(0.0, 0.02, dist);
    
    // セルの色（時間によって変化）
    vec3 cellColor = 0.5 + 0.5 * cos(
        u_time * 0.5 + finalVoronoi.yz.xyx * 3.0 + vec3(0.0, 2.0, 4.0)
    );
    
    // 最終的な色の合成
    vec3 color = vec3(0.0);
    // = mix(vec3(0.0), cellColor, border);
    
    // グローエフェクト
    color += (1.0 - border) * 0.3;
    
    // 中央の円を合成（ボロノイで歪ませる）
    float circleRadius = 0.3;
    
    // ボロノイの距離を使って円を歪ませる
    float voronoiDistortion = finalVoronoi.x * 0.15;
    float distortedCenterDist = distToCenter + voronoiDistortion * sin(u_time * 0.5);
    
    float circleDist = distortedCenterDist / circleRadius;
    float circle = smoothstep(1.0, 0.9, circleDist);
    
    // 円のグラデーション色（ボロノイの色も混ぜる）
    //vec3 circleColor = vec3(1.0, 0.8, 0.3) * (1.0 - circleDist * 0.5);
    //circleColor = mix(circleColor, cellColor * 1.5, voronoiDistortion * 2.0);
    
    // 円とボロノイを合成
    //color = mix(color, circleColor, circle * 0.9);
    
    // 歪んだ円の境界線を追加
    float circleBorder = smoothstep(0.95, 1.0, circleDist) - smoothstep(1.0, 1.05, circleDist);
    color += vec3(1.0, 0.9, 0.5) * circleBorder * 3.0;
    
    gl_FragColor = vec4(color, 1.0);
}
`;

function setup() {
  createCanvas(800, 800, WEBGL);

  // シェーダーを作成
  myShader = createShader(vertShader, fragShader);
}

function draw() {
  // シェーダーを適用
  shader(myShader);

  // ユニフォーム変数を設定
  myShader.setUniform("u_time", millis() / 1000.0);
  myShader.setUniform("u_resolution", [width, height]);

  // 全画面の矩形を描画
  rect(0, 0, width, height);
}

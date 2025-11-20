// FBMで歪みを加えるフラグメントシェーダ
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 vTexCoord;

// ノイズ関数
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 2Dノイズ
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// FBM（Fractional Brownian Motion）
float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  // 5オクターブのノイズを重ねる
  for(int i = 0; i < 5; i++) {
    value += amplitude * noise(st * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

void main() {
  vec2 uv = vTexCoord;
  
  // FBMで歪み量を計算
  float time = u_time * 0.2;
  vec2 distortPos = uv * 3.0 + time * 0.1;
  
  // 2方向のFBMで複雑な歪みを作る
  float fbm1 = fbm(distortPos + vec2(time, 0.0));
  float fbm2 = fbm(distortPos + vec2(0.0, time * 0.7));
  
  // 歪みの強度
  float distortStrength = 0.03;
  vec2 distortion = vec2(fbm1, fbm2) * distortStrength;
  
  // 波状の追加歪み（毛糸の揺らぎ）
  float wave = sin(uv.y * 10.0 + time * 2.0) * 0.005;
  distortion.x += wave;
  
  // 歪んだUV座標でテクスチャをサンプリング
  vec2 distortedUV = uv + distortion;
  vec4 color = texture2D(tex0, distortedUV);
  
  // 色収差風の効果を追加（毛糸のもふもふ感を強調）
  float chromaOffset = 0.002;
  float r = texture2D(tex0, distortedUV + vec2(chromaOffset, 0.0)).r;
  float g = color.g;
  float b = texture2D(tex0, distortedUV - vec2(chromaOffset, 0.0)).b;
  
  gl_FragColor = vec4(r, g, b, color.a);
}

// グリッチ用フラグメントシェーダ (p5.js 用)
// 画面テクスチャ tex0 を少しRGBずらし & ラインノイズ & ブロックディストーション
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;      // 入力テクスチャ
uniform vec2 u_resolution;   // 画面サイズ
uniform float u_time;        // 時間

// ランダム
float hash(vec2 p){
  p = fract(p*vec2(123.34, 345.45));
  p += dot(p, p+34.345);
  return fract(p.x*p.y);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 baseUV = uv;

  // 横スキャンライン歪み（行単位でXを少しずらす）
  float line = sin(uv.y*120.0 + u_time*8.0)*0.0015;
  uv.x += line;

  // ブロックノイズ（大きめ格子でオフセット）
  vec2 blockId = floor(uv*vec2(20.0, 12.0));
  float h = hash(blockId + floor(u_time));
  float blockShift = step(0.85, h) * (hash(blockId*1.37)*0.04 - 0.02); // 15% くらい発生
  uv.x += blockShift;

  // RGB チャンネル別ずらし
  float chroma = 0.004 + 0.002*sin(u_time*3.0);
  vec2 dir = vec2(sin(u_time*1.2), cos(u_time*0.7));
  vec2 offR = dir * chroma;
  vec2 offB = -dir * chroma;

  vec4 colR = texture2D(tex0, uv + offR);
  vec4 colG = texture2D(tex0, uv);
  vec4 colB = texture2D(tex0, uv + offB);
  vec4 col = vec4(colR.r, colG.g, colB.b, 1.0);

  // ラインフラッシュ
  float flash = step(0.995, fract(sin(uv.y*500.0 + u_time*20.0)*43758.5453));
  col.rgb += flash * 0.3;

  // 端のノイズ暗 vignette
  float vign = smoothstep(0.0, 0.6, length(uv-0.5));
  col.rgb *= 1.0 - vign*0.15;

  gl_FragColor = col;
}

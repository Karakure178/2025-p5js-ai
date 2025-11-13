// フルスクリーン矩形用パススルー頂点シェーダ
// p5.js の行列を適用しないと座標が -1..1 クリップ空間と噛み合わず中央だけ表示になる
#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;   // 位置（p5 が渡す）
attribute vec2 aTexCoord;   // UV
uniform mat4 uProjectionMatrix; // p5.js 提供
uniform mat4 uModelViewMatrix;  // p5.js 提供
varying vec2 vTexCoord;     // フラグメントへ

void main(){
  vTexCoord = aTexCoord;
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}

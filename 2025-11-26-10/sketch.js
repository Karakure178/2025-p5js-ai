// 立方体を球の表面上で回転させるアニメーション

let sphereRadius = 200; // 球の半径
let cubes = []; // 立方体の配列
let numCubes = 20; // 立方体の数
let drawLayer; // 描画レイヤー
let pencilShader; // 鉛筆風シェーダー
let time = 0; // 時間変数

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");

  // 描画レイヤーを作成
  drawLayer = createGraphics(800, 800, WEBGL);

  // 鉛筆風シェーダーを作成
  pencilShader = createShader(vertexShader(), fragmentShader());

  // 複数の立方体を初期化
  for (let i = 0; i < numCubes; i++) {
    cubes.push({
      size: random(20, 60), // ランダムなサイズ
      angleOffset: random(TWO_PI), // 初期角度のオフセット
      speed: random(0.02, 0.05), // 回転速度（最低）
      phiOffset: random(TWO_PI), // 緯度のオフセット
      phiSpeed: random(0.1, 30), // 緯度変化の速度（最低）
      color: color(random(100, 255), random(100, 255), random(100, 255)), // ランダムな色
      rotSpeed: createVector(1, 1, 1), // 自転速度を0に
    });
  }
}

function draw() {
  // 時間を更新（deltaTimeを使って真に等速に）
  time += deltaTime / 1000.0; // 秒単位で増加

  // drawLayerに立方体を描画
  drawLayer.background(240, 240, 235); // 紙の色

  // ライティング設定
  drawLayer.ambientLight(80);
  drawLayer.directionalLight(255, 255, 255, 0.5, 0.5, -1);
  drawLayer.pointLight(150, 150, 255, 200, -200, 200);

  // カメラを回転（停止中）
  // drawLayer.rotateY(time * 0.03);
  // drawLayer.rotateX(time * 0.02);

  // 各立方体を描画
  for (let cube of cubes) {
    // 球の表面上の位置を計算（等速）
    let angle = time * cube.speed + cube.angleOffset;
    let theta = angle; // 経度
    let phi = sin(angle * cube.phiSpeed + cube.phiOffset) * PI * 0.5 + PI * 0.5; // 緯度を波形で変化

    // 球面座標から直交座標に変換
    let x = sphereRadius * sin(phi) * cos(theta);
    let y = sphereRadius * cos(phi);
    let z = sphereRadius * sin(phi) * sin(theta);

    // 立方体を球の表面に配置
    drawLayer.push();
    drawLayer.translate(x, y, z);

    // 立方体を球の中心方向に向ける
    let dir = createVector(x, y, z);
    dir.normalize();

    // 回転を適用
    drawLayer.rotateZ(atan2(dir.y, dir.x));
    drawLayer.rotateY(atan2(dir.x, dir.z));

    // 立方体自体も回転（等速）
    drawLayer.rotateX(time * cube.rotSpeed.x);
    drawLayer.rotateY(time * cube.rotSpeed.y);
    drawLayer.rotateZ(time * cube.rotSpeed.z);

    // 立方体を描画（鉛筆風の色調に）
    let c = cube.color;
    let gray = (red(c) + green(c) + blue(c)) / 3;
    drawLayer.fill(gray * 0.6, gray * 0.6, gray * 0.6);
    drawLayer.stroke(40, 40, 50);
    drawLayer.strokeWeight(1.5);
    drawLayer.box(cube.size);
    drawLayer.pop();
  }

  // 鉛筆風シェーダーを適用
  shader(pencilShader);
  pencilShader.setUniform("u_texture", drawLayer);
  pencilShader.setUniform("u_resolution", [width, height]);
  pencilShader.setUniform("u_time", time); // time変数を使用

  // 全画面に描画
  noStroke();
  plane(width, height);
}

// 頂点シェーダー
function vertexShader() {
  return `
    precision highp float;
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
}

// フラグメントシェーダー（鉛筆スケッチ風エフェクト）
function fragmentShader() {
  return `
    precision mediump float;
    varying vec2 vTexCoord;
    
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_time;
    
    // ハッシュ関数
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    // 2Dノイズ
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    // フラクタルブラウン運動
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vTexCoord;
      vec2 texel = 1.0 / u_resolution;
      
      // 鉛筆の紙のテクスチャ
      float paperTexture = fbm(uv * 80.0 + u_time * 0.02);
      paperTexture = paperTexture * 0.15 + 0.85;
      
      // 手ぶれ風の歪み
      float distortion = 0.003;
      float shakex = (noise(vec2(uv.y * 10.0, u_time * 0.5)) - 0.5) * distortion;
      float shakey = (noise(vec2(uv.x * 10.0, u_time * 0.5 + 100.0)) - 0.5) * distortion;
      vec2 distortedUV = uv + vec2(shakex, shakey);
      
      // 元の色を取得
      vec4 color = texture2D(u_texture, distortedUV);
      
      // エッジ検出（Sobel フィルタ）
      float edge = 0.0;
      float offset = 1.5;
      
      // 3x3のカーネルでエッジ検出
      vec4 n = texture2D(u_texture, distortedUV + vec2(0.0, -texel.y * offset));
      vec4 s = texture2D(u_texture, distortedUV + vec2(0.0, texel.y * offset));
      vec4 e = texture2D(u_texture, distortedUV + vec2(texel.x * offset, 0.0));
      vec4 w = texture2D(u_texture, distortedUV + vec2(-texel.x * offset, 0.0));
      
      vec4 ne = texture2D(u_texture, distortedUV + vec2(texel.x, -texel.y) * offset);
      vec4 nw = texture2D(u_texture, distortedUV + vec2(-texel.x, -texel.y) * offset);
      vec4 se = texture2D(u_texture, distortedUV + vec2(texel.x, texel.y) * offset);
      vec4 sw = texture2D(u_texture, distortedUV + vec2(-texel.x, texel.y) * offset);
      
      // Sobelオペレーター
      vec4 sobelX = -nw - 2.0 * w - sw + ne + 2.0 * e + se;
      vec4 sobelY = -nw - 2.0 * n - ne + sw + 2.0 * s + se;
      edge = length(sobelX) + length(sobelY);
      
      // エッジを強調
      edge = smoothstep(0.1, 0.5, edge);
      
      // 鉛筆の濃淡を表現
      float brightness = (color.r + color.g + color.b) / 3.0;
      
      // ハッチング風のストローク
      float hatch = 0.0;
      float angle1 = 0.785398; // 45度
      float angle2 = -0.785398; // -45度
      vec2 rotUV1 = vec2(
        uv.x * cos(angle1) - uv.y * sin(angle1),
        uv.x * sin(angle1) + uv.y * cos(angle1)
      );
      vec2 rotUV2 = vec2(
        uv.x * cos(angle2) - uv.y * sin(angle2),
        uv.x * sin(angle2) + uv.y * cos(angle2)
      );
      
      float lines1 = sin(rotUV1.x * 150.0 + noise(uv * 50.0) * 2.0);
      float lines2 = sin(rotUV2.x * 150.0 + noise(uv * 50.0 + 50.0) * 2.0);
      
      hatch = (lines1 + lines2) * 0.5;
      hatch = smoothstep(0.3, 0.7, hatch);
      
      // 暗い部分にハッチングを適用
      float hatchIntensity = smoothstep(0.7, 0.3, brightness);
      brightness = mix(brightness, brightness * (0.7 + hatch * 0.3), hatchIntensity);
      
      // エッジラインを濃く
      brightness = brightness * (1.0 - edge * 0.8);
      
      // 紙のテクスチャを適用
      brightness *= paperTexture;
      
      // 鉛筆風のグレースケール
      vec3 pencilColor = vec3(brightness);
      
      // 少しセピア調に
      pencilColor = mix(pencilColor, vec3(brightness * 0.9, brightness * 0.85, brightness * 0.8), 0.2);
      
      gl_FragColor = vec4(pencilColor, 1.0);
    }
  `;
}

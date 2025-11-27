// 立方体を球の表面上で回転させるアニメーション（鉛筆スケッチ風）

let sphereRadius = 200;
let cubes = [];
let numCubes = 20;
let drawLayer;
let pencilShader;
let time = 0;

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");

  drawLayer = createGraphics(800, 800, WEBGL);
  pencilShader = createShader(vertexShader(), fragmentShader());

  // 立方体を初期化
  let colors = [
    "#BF1A1A",
    "#FF6C0C",
    "#FFD300",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
  ];

  for (let i = 0; i < numCubes; i++) {
    cubes.push({
      size: random(20, 60),
      angleOffset: random(TWO_PI),
      speed: random(0.02, 0.05),
      phiOffset: random(TWO_PI),
      phiSpeed: random(0.1, 9),
      color: random(colors), // カラフルな色をランダムに選択
      rotSpeed: createVector(1, 1, 1),
    });
  }
}

function draw() {
  time += deltaTime / 1000.0;

  drawLayer.background(0);
  drawLayer.ambientLight(80);
  drawLayer.directionalLight(255, 255, 255, 0.5, 0.5, -1);
  drawLayer.pointLight(150, 150, 255, 200, -200, 200);

  // 各立方体を描画
  for (let cube of cubes) {
    // 球面座標計算
    let angle = time * cube.speed + cube.angleOffset;
    let theta = angle;
    let phi = sin(angle * cube.phiSpeed + cube.phiOffset) * PI * 0.5 + PI * 0.5;

    let x = sphereRadius * sin(phi) * cos(theta);
    let y = sphereRadius * cos(phi);
    let z = sphereRadius * sin(phi) * sin(theta);

    drawLayer.push();
    drawLayer.translate(x, y, z);

    // 球の中心方向に向ける
    let dir = createVector(x, y, z);
    dir.normalize();
    drawLayer.rotateZ(atan2(dir.y, dir.x));
    drawLayer.rotateY(atan2(dir.x, dir.z));

    // 自転
    drawLayer.rotateX(time * cube.rotSpeed.x);
    drawLayer.rotateY(time * cube.rotSpeed.y);
    drawLayer.rotateZ(time * cube.rotSpeed.z);

    // カラフルな描画
    let cubeColor = cube.color;

    // エッジを重ねて描画
    for (let layer = 0; layer < 12; layer++) {
      drawLayer.push();

      let noiseScale = layer * 15;
      let jitterX =
        noise(cube.angleOffset + frameCount * 0.4 + noiseScale) * 6 - 3;
      let jitterY =
        noise(cube.angleOffset + 100 + frameCount * 0.4 + noiseScale) * 6 - 3;
      let jitterZ =
        noise(cube.angleOffset + 200 + frameCount * 0.4 + noiseScale) * 6 - 3;

      let rotJitter =
        noise(cube.angleOffset + frameCount * 0.2 + layer * 20) * 0.15;
      drawLayer.rotateX(rotJitter);
      drawLayer.rotateY(rotJitter * 0.7);
      drawLayer.rotateZ(rotJitter * 0.5);
      drawLayer.translate(jitterX, jitterY, jitterZ);

      let alpha = map(layer, 0, 11, 220, 20) + random(-30, 30);
      let weight = map(layer, 0, 11, 4.0, 0.5) + random(-0.3, 0.3);

      // 色を少し暗くしてエッジに使用
      drawLayer.stroke(
        red(cubeColor) * 1,
        green(cubeColor) * 1,
        blue(cubeColor) * 1,
        alpha
      );
      drawLayer.strokeWeight(weight);
      drawLayer.noFill();
      drawLayer.box(cube.size);
      drawLayer.pop();
    }

    // 塗りつぶし（固定された色）
    drawLayer.noStroke();
    //drawLayer.fill(cubeColor);
    //drawLayer.box(cube.size);
    drawLayer.pop();
  }

  // シェーダー適用
  shader(pencilShader);
  pencilShader.setUniform("u_texture", drawLayer);
  pencilShader.setUniform("u_resolution", [width, height]);
  pencilShader.setUniform("u_time", time);

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
      
      // 元の色を取得
      vec4 color = texture2D(u_texture, uv);
      
      // エッジ検出（立方体の周辺を検出）
      float edge = 0.0;
      float offset = 1.5;
      
      vec4 n = texture2D(u_texture, uv + vec2(0.0, -texel.y * offset));
      vec4 s = texture2D(u_texture, uv + vec2(0.0, texel.y * offset));
      vec4 e = texture2D(u_texture, uv + vec2(texel.x * offset, 0.0));
      vec4 w = texture2D(u_texture, uv + vec2(-texel.x * offset, 0.0));
      
      vec4 ne = texture2D(u_texture, uv + vec2(texel.x, -texel.y) * offset);
      vec4 nw = texture2D(u_texture, uv + vec2(-texel.x, -texel.y) * offset);
      vec4 se = texture2D(u_texture, uv + vec2(texel.x, texel.y) * offset);
      vec4 sw = texture2D(u_texture, uv + vec2(-texel.x, texel.y) * offset);
      
      vec4 sobelX = -nw - 2.0 * w - sw + ne + 2.0 * e + se;
      vec4 sobelY = -nw - 2.0 * n - ne + sw + 2.0 * s + se;
      edge = length(sobelX) + length(sobelY);
      edge = smoothstep(0.1, 0.5, edge);
      
      // 立方体かどうかを判定（背景色以外）
      float isObject = step(0.95, length(color.rgb));
      
      // グリッチエフェクトを立方体周辺に豪快に適用
      vec2 glitchUV = uv;
      if (edge > 0.05 && isObject > 0.5) {
        // 強烈なRGBずらし
        float glitchAmount = edge * noise(vec2(uv.y * 30.0, u_time * 8.0)) * 0.08;
        float glitchAmount2 = noise(vec2(uv.x * 25.0, u_time * 6.0)) * 0.06;
        
        vec4 colorR = texture2D(u_texture, uv + vec2(glitchAmount * 2.0, glitchAmount2));
        vec4 colorG = texture2D(u_texture, uv);
        vec4 colorB = texture2D(u_texture, uv - vec2(glitchAmount * 2.0, -glitchAmount2));
        color = vec4(colorR.r, colorG.g, colorB.b, 1.0);
        
        // 大きなブロックノイズ
        vec2 blockUV = floor(uv * 20.0 + u_time * 8.0);
        float blockNoise = noise(blockUV);
        if (blockNoise > 0.6) {
          float intensity = noise(blockUV * 5.0 + u_time * 15.0);
          color.rgb = mix(color.rgb, vec3(intensity), 0.7);
        }
        
        // 横方向のグリッチライン
        float lineGlitch = step(0.95, noise(vec2(0.0, floor(uv.y * 80.0) + u_time * 20.0)));
        if (lineGlitch > 0.5) {
          float shift = (noise(vec2(u_time * 10.0, uv.y * 50.0)) - 0.5) * 0.15;
          color = texture2D(u_texture, uv + vec2(shift, 0.0));
          color.rgb += vec3(0.3);
        }
        
        // 激しい走査線
        float scanline = sin(uv.y * 1200.0 + u_time * 30.0);
        color.rgb += scanline * edge * 0.3;
        
        // ランダムなピクセル破壊
        float pixelNoise = noise(uv * 200.0 + u_time * 25.0);
        if (pixelNoise > 0.9) {
          color.rgb = vec3(noise(uv * 300.0 + u_time * 50.0));
        }
        
        // 色相シフト
        float hueShift = noise(vec2(u_time * 5.0, edge)) * 2.0;
        color.rgb = color.rgb * (1.0 + hueShift * edge);
      }
      
      // 鉛筆の紙のテクスチャ
      float paperTexture = fbm(uv * 80.0 + u_time * 0.02);
      paperTexture = paperTexture * 0.15 + 0.85;
      
      // カラーを保持したまま紙のテクスチャのみ適用
      vec3 finalColor = color.rgb * paperTexture;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;
}

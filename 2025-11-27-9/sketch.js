// GLSLでハートをくり抜く

let pg; // マスク用グラフィックス
let theShader; // シェーダー
let color_pg; // カラー

function setup() {
  const canvas = createCanvas(800, 800, WEBGL);
  canvas.parent("canvas-container");
  colorMode(HSB, 360, 100, 100, 100);

  // p5.brushを初期化
  brush.load();

  // シェーダーを作成
  theShader = createShader(shader1.vs, shader1.fs);
  color_pg = rand_color("#FA9884");

  translate(-width / 2, -height / 2);
  brushGrid(3);

  // マスク用グラフィックスを作成（ハート形状）
  setTimeout(() => {
    pg = createGraphics(width, height);
    pg.background("#091221");
    pg.erase();
    pg.push();

    // ハートの形状を描画
    drawHeartMask(pg, pg.width / 2, pg.height / 2, 300);

    pg.pop();
    pg.noErase();

    // シェーダーを適用
    push();
    shader(theShader);
    theShader.setUniform("u_tex", pg);
    theShader.setUniform("u_resolution", [pg.width, pg.height]);
    theShader.setUniform("u_time", -frameCount / 35);
    theShader.setUniform("u_color0", color_pg);
    image(pg, 0, 0);
    pop();
  }, 0);
}

function draw() {
  // 静止画なのでdrawは空
}

// グリッド状にブラシで描画
function brushGrid(num) {
  const n1 = num + 1;
  const w = width;
  const h = height;

  const margin_left = w / n1 / n1;
  const margin_bottom = h / n1 / n1;
  const nw = w / n1;
  const nh = h / n1;

  push();
  brush.push();
  brush.bleed(0.02, 0.3, 1);

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);

      if (j % 2 === 0) {
        brush.fill("#B31312", random(30, 140));
        brush.rect(x, y, nw, nh);
      } else {
        brush.fill("#EA906C", random(30, 140));
        brush.rect(x, y, nw, nh);
      }
    }
  }

  brush.pop();
  pop();
}

// ハート形状をマスク用に描画
function drawHeartMask(pg, centerX, centerY, size) {
  pg.push();
  pg.translate(centerX, centerY);

  // ハートの形状を計算
  pg.beginShape();
  for (let angle = 0; angle < TWO_PI; angle += 0.05) {
    let x = (size * 16 * pow(sin(angle), 3)) / 16;
    let y =
      (-size *
        (13 * cos(angle) -
          5 * cos(2 * angle) -
          2 * cos(3 * angle) -
          cos(4 * angle))) /
      16;
    pg.vertex(x, y);
  }
  pg.endShape(CLOSE);

  pg.pop();
}

// カラーコードをシェーダー用の配列に変換
const rand_color = (colorCode) => {
  let rc = color(colorCode);
  return [red(rc) / 255.0, green(rc) / 255.0, blue(rc) / 255.0];
};

// キー入力で保存
function keyPressed() {
  if (key === "s") {
    saveCanvas("heart-cutout", "png");
  }
}

// シェーダー定義
const shader1 = {
  vs: `
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
`,
  fs: `
  precision highp float;
  precision highp int;

  varying vec2 vTexCoord;

  uniform sampler2D u_tex;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color0;

  float pi = 3.14159265358979;

  vec2 random(vec2 st){
    st = vec2(dot(st, vec2(127.1, 311.7)),
              dot(st, vec2(269.5, 183.3)));
    return 2.0 * fract(sin(st) * 43758.5453123) - 1.0;
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(random(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)), 
                   dot(random(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(random(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), 
                   dot(random(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = vTexCoord;

    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 pos = vec2(st * 10.0);
    vec3 noise_val = vec3(noise(pos) * 0.5 + 0.5);

    uv.x += 0.08 * cos(uv.y * pi * 5.0 + u_time);
    vec3 color = mix(u_color0, noise_val, cos(uv.x * pi * 5.0 + u_time));

    vec4 tex = texture2D(u_tex, uv);
    gl_FragColor = vec4(color, 1.0) * tex;
  }
`,
};

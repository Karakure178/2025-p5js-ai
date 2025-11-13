// 複数テキストを斜め移動させ 画面外へ出たら初期位置へワープさせるアニメーション
// クラス化で整理した版

let messages = []; // Message インスタンス配列
let fontSize = 44; // 基本フォントサイズ

// シェーダ関連
let glitchShader; // GLSL シェーダ
let sceneG; // 2D 描画用グラフィックバッファ

// 円アニメーション用パラメータ
let circlePhase = 0; // 角度（時間経過）
let circleBase = 160; // 基本半径
let circleAmp = 100; // 揺れ幅

// =====================
// Message クラス
// =====================
class Message {
  constructor(msg, x, y, vx, vy, col) {
    this.msg = msg; // 文字列
    this.x = x; // 現在位置 X
    this.y = y; // 現在位置 Y
    this.sx = x; // 初期位置 X
    this.sy = y; // 初期位置 Y
    this.vx = vx; // 速度 X
    this.vy = vy; // 速度 Y
    this.col = col; // 色
  }

  // フレーム毎の更新と描画
  updateAndDraw() {
    const w = textWidth(this.msg);
    const h = textAscent() + textDescent();

    // 影
    fill(0, 80);
    text(this.msg, this.x + 3, this.y + 3);
    // 本体
    fill(this.col);
    text(this.msg, this.x, this.y);

    // 移動
    this.x += this.vx;
    this.y += this.vy;

    // 完全に画面外へ出たら初期位置へ戻す（方向は維持）
    if (this.x > width || this.x + w < 0 || this.y > height || this.y + h < 0) {
      this.x = this.sx;
      this.y = this.sy;
    }
  }

  // ランダム生成ヘルパー
  static random(msg) {
    const x = random(40, width - 120);
    const y = random(40, height - 80);
    const vx = random([-3, -2, -1, 1, 2, 3]);
    const vy = random([-3, -2, -1, 1, 2, 3]);
    const col = color(random(120, 255), random(120, 255), random(120, 255));
    return new Message(msg, x, y, vx, vy, col);
  }
}

function preload() {
  // フラグメントシェーダ読み込み
  glitchShader = loadShader("glsl-pass.vert", "glitch.frag");
}

function setup() {
  // WEBGL でメインキャンバスを作りポストプロセス用に利用
  const c = createCanvas(800, 800, WEBGL);
  c.parent("canvas-container");

  // 2D 描画内容をまとめるバッファ（通常の p5 2D API 用）
  sceneG = createGraphics(width, height); // デフォルト 2D
  sceneG.textSize(fontSize);
  sceneG.textAlign(LEFT, TOP);

  // 100言語の挨拶（"こんにちは" 相当の多言語表現）
  const words = [
    "こんにちは",
    "Hello",
    "Hola",
    "Bonjour",
    "Hallo",
    "Ciao",
    "Olá",
    "Привет",
    "你好",
    "您好",
    "早安",
    "안녕하세요",
    "สวัสดี",
    "Xin chào",
    "नमस्ते",
    "নমস্কার",
    "مرحبا",
    "سلام",
    "Merhaba",
    "Hei",
    "Moi",
    "Hej",
    "Goddag",
    "Halló",
    "Kamusta",
    "Halo",
    "Selamat",
    "שלום",
    "Szia",
    "Ahoj",
    "Čau",
    "Dzień dobry",
    "Bună",
    "Zdravo",
    "Bok",
    "Sveiki",
    "Labas",
    "Tere",
    "Sawubona",
    "Jambo",
    "Habari",
    "Γεια σας",
    "Γεια σου",
    "Ola",
    "Kaixo",
    "Dia duit",
    "Goeie dag",
    "Talofa",
    "Kia ora",
    "Malo e lelei",
    "Bula",
    "Kumusta",
    "Saluton",
    "Howdy",
    "Yo",
    "Hiya",
    "Sup",
    "Ahoy",
    "Namaskar",
    "Vanakkam",
    "Sat sri akaal",
    "Asalaam alaikum",
    "Shalom aleichem",
    "Mabuhay",
    "Privet",
    "Dobry den",
    "Buenos días",
    "Buenas",
    "Salut",
    "Servus",
    "Grüezi",
    "Cześć",
    "God morgen",
    "God kveld",
    "Tashi delek",
    "Selam",
    "Sannu",
    "Moni",
    "ສະບາຍດີ",
    "Kia orana",
    "Ia ora na",
    "Malo",
    "Hej hej",
    "Heippa",
    "Здравей",
    "Ćao",
    "Hujambo",
    "Kumusta ka",
    "Slav",
    "Merħba",
    "Բարեւ",
    "Barev",
    "Salom",
    "Сайн байна уу",
    "Kumusta po",
    "Aloha",
    "Muraho",
    "Manao ahoana",
    "Talofa lava",
    "Bon dia",
  ];

  // 各文字列ごとにインスタンス生成
  for (const w of words) messages.push(Message.random(w));
}

function draw() {
  // まず 2D バッファにシーンを描画
  sceneG.push();
  sceneG.background(15, 16, 30);
  sceneG.noStroke();

  // 各メッセージ更新/描画（sceneG 上）
  sceneG.push();
  // テキスト計測 API 利用のため一時的に textFont/size は sceneG に紐づく
  for (const m of messages) {
    // 計測は main の textWidth を使用できないため sceneG.textWidth
    const w = sceneG.textWidth(m.msg);
    const h = sceneG.textAscent() + sceneG.textDescent();

    // 影
    sceneG.fill(0, 80);
    sceneG.text(m.msg, m.x + 3, m.y + 3);
    // 本体
    sceneG.fill(m.col);
    sceneG.text(m.msg, m.x, m.y);

    // 移動
    m.x += m.vx;
    m.y += m.vy;
    if (m.x > width || m.x + w < 0 || m.y > height || m.y + h < 0) {
      m.x = m.sx;
      m.y = m.sy;
    }
  }
  sceneG.pop();

  // 中央円（sceneG 上）
  circlePhase += 0.03;
  const r = circleBase + sin(circlePhase) * circleAmp;
  sceneG.push();
  sceneG.translate(width / 2, height / 2);
  sceneG.noStroke();
  for (let i = 3; i >= 1; i--) {
    const rr = r * (i / 3.0);
    sceneG.fill(70, 120, 255, 25 + i * 15);
    sceneG.ellipse(0, 0, rr * 2, rr * 2);
  }
  sceneG.noFill();
  sceneG.stroke(140, 200, 255, 140);
  sceneG.strokeWeight(2);
  sceneG.ellipse(0, 0, r * 2 + 4, r * 2 + 4);
  sceneG.pop();

  // ========== ポストプロセス（グリッチシェーダ） =============
  shader(glitchShader);
  glitchShader.setUniform("tex0", sceneG);
  // 高 DPI (pixelDensity>1) だと gl_FragCoord が拡大され左下1/4のみ有効になるため補正
  const d = pixelDensity();
  glitchShader.setUniform("u_resolution", [width * d, height * d]);
  glitchShader.setUniform("u_time", millis() / 1000.0);

  // 全画面クワッド: plane を利用（p5 は中心基準なのでそのまま width,height 指定）
  noStroke();
  push();
  // XY 平面にそのまま貼る（デフォルトカメラで可視）
  plane(width, height);
  pop();
}

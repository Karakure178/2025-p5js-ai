// 複数のテキストを斜めに走らせるアニメーション
// シンプル: 各テキストは独立して反射移動

// メッセージオブジェクト配列
// { msg, x, y, vx, vy, col }
let messages = [];
let fontSize = 44; // 基本フォントサイズ（大きく表示）
let firstFrame = true; // 初回クリア判定

function setup() {
  const c = createCanvas(800, 800); // 固定サイズ（必要なら windowWidth/windowHeight に変更可）
  c.parent("canvas-container");
  textSize(fontSize);
  textAlign(LEFT, TOP);
  colorMode(HSB, 360, 100, 100, 100); // HSBで色を遊ばせる

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

  // 各文字列に対してオブジェクト生成
  for (let w of words) {
    messages.push(createMessage(w));
  }
}

// メッセージ用オブジェクト生成関数
function createMessage(str) {
  return {
    msg: str,
    // ランダム初期位置（少し余白）
    x: random(40, width - 160),
    y: random(40, height - 120),
    // -3〜3 で 0 を避ける速度
    vx: random([-3, -2, -1, 1, 2, 3]),
    vy: random([-3, -2, -1, 1, 2, 3]),
    // 動的カラー用パラメータ
    hueOff: random(360),
    spinSeed: random(TWO_PI),
    baseSize: fontSize,
    popTimer: 0, // クリック時のポップ演出カウンタ
  };
}

function draw() {
  // 遊び: 半透明で塗り重ねて残像効果
  if (firstFrame) {
    background(230, 20, 8); // HSB (色味のある濃紺/紫系)
    firstFrame = false;
  } else {
    noStroke();
    fill(230, 40, 8, 12); // かなり薄いベール
    rect(0, 0, width, height);
  }

  // 各メッセージ処理
  for (let m of messages) {
    // 動的サイズ（ゆらぎ + ポップ）
    let scaleWave = 1 + 0.18 * sin(frameCount * 0.07 + m.spinSeed);
    if (m.popTimer > 0) {
      scaleWave += (m.popTimer / 20) * 0.8; // ポップ拡大
      m.popTimer--;
    }
    const currentSize = m.baseSize * scaleWave;
    textSize(currentSize);
    const w = textWidth(m.msg);
    const h = textAscent() + textDescent();

    // 回転角（ゆっくり）
    const ang = sin(frameCount * 0.01 + m.spinSeed) * 0.35; // -0.35~0.35 rad

    // カラー循環（HSB）
    const hue = (m.hueOff + frameCount * 0.6) % 360;

    // 影 & 本体（push/popで独立変換）
    push();
    translate(m.x + w / 2, m.y + h / 2);
    rotate(ang);
    // 影
    fill(hue, 50, 20, 70);
    text(m.msg, -w / 2 + 4, -h / 2 + 4);
    // 本体
    fill(hue, 70, 100, 100);
    text(m.msg, -w / 2, -h / 2);
    pop();

    // 軌道: わずかに蛇行させる（xにサイン加算）
    const wobble = sin(frameCount * 0.05 + m.spinSeed) * 0.5;
    m.x += m.vx + wobble;
    m.y += m.vy;

    // 反射（簡易的に回転を無視したバウンディングで判定）
    if (m.x < 0) {
      m.x = 0;
      m.vx *= -1;
    } else if (m.x + w > width) {
      m.x = width - w;
      m.vx *= -1;
    }
    if (m.y < 0) {
      m.y = 0;
      m.vy *= -1;
    } else if (m.y + h > height) {
      m.y = height - h;
      m.vy *= -1;
    }
  }

  // 軽いランダム気流: 時々全体に微小な揺らぎを与える
  if (frameCount % 240 === 0) {
    for (let m of messages) {
      m.vx += random(-0.5, 0.5);
      m.vy += random(-0.5, 0.5);
      // 速度幅を制限
      m.vx = constrain(m.vx, -4, 4);
      m.vy = constrain(m.vy, -4, 4);
    }
  }

  // ヒント表示
  textSize(16);
  fill(0, 0, 100, 85);
  const hint = "クリック: 追加 / 既存をクリック: ポップ";
  const tw = textWidth(hint);
  text(hint, width - tw - 12, height - 28);
  textSize(fontSize); // 戻す
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function mousePressed() {
  // 既存にヒットしたか判定（上に描いたもの優先で逆順）
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    textSize(m.baseSize); // おおよそのサイズ判定用
    const w = textWidth(m.msg);
    const h = textAscent() + textDescent();
    if (
      mouseX >= m.x &&
      mouseX <= m.x + w &&
      mouseY >= m.y &&
      mouseY <= m.y + h
    ) {
      // ポップ演出 & ランダム速度再付与
      m.popTimer = 20;
      m.vx = random([-4, -3, -2, 2, 3, 4]);
      m.vy = random([-4, -3, -2, 2, 3, 4]);
      m.hueOff = random(360); // 色も変化
      return; // 追加はしない
    }
  }
  // ヒットしなければ追加
  const label = `Add${messages.length}`;
  const nm = createMessage(label);
  nm.x = mouseX;
  nm.y = mouseY;
  messages.push(nm);
}

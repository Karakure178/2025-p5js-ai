// 複数テキストを斜め移動させ 画面外へ出たら初期位置へワープさせるアニメーション
// クラス化で整理した版

let messages = []; // Message インスタンス配列
let fontSize = 44; // 基本フォントサイズ

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

function setup() {
  const c = createCanvas(800, 800); // 固定サイズ（必要なら windowWidth/windowHeight に変更可）
  c.parent("canvas-container");
  textSize(fontSize);
  textAlign(LEFT, TOP);

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
  background(15, 16, 30);
  noStroke();

  // 各メッセージ更新/描画
  for (const m of messages) m.updateAndDraw();

  // 操作ヒント
  fill(255, 140);
  textSize(14);
  const hint = "クリック: 新しいテキスト追加";
  const tw = textWidth(hint);
  text(hint, width - tw - 12, height - 24);
  textSize(fontSize);
}

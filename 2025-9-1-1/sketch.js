// 複数のテキストを斜めに走らせるアニメーション
// シンプル: 各テキストは独立して反射移動

// メッセージオブジェクト配列
// { msg, x, y, vx, vy, col }
let messages = [];
let fontSize = 44; // 基本フォントサイズ（大きく表示）

function setup() {
  const c = createCanvas(800, 800); // 固定サイズ（必要なら windowWidth/windowHeight に変更可）
  c.parent("canvas-container");
  textSize(fontSize);
  textAlign(LEFT, TOP);

  // 100言語の挨拶（"こんにちは" 相当の多言語表現）
  const words = [
    "こんにちは","Hello","Hola","Bonjour","Hallo","Ciao","Olá","Привет","你好","您好",
    "早安","안녕하세요","สวัสดี","Xin chào","नमस्ते","নমস্কার","مرحبا","سلام","Merhaba","Hei",
    "Moi","Hej","Goddag","Halló","Kamusta","Halo","Selamat","שלום","Szia","Ahoj",
    "Čau","Dzień dobry","Bună","Zdravo","Bok","Sveiki","Labas","Tere","Sawubona","Jambo",
    "Habari","Γεια σας","Γεια σου","Ola","Kaixo","Dia duit","Goeie dag","Talofa","Kia ora","Malo e lelei",
    "Bula","Kumusta","Saluton","Howdy","Yo","Hiya","Sup","Ahoy","Namaskar","Vanakkam",
    "Sat sri akaal","Asalaam alaikum","Shalom aleichem","Mabuhay","Privet","Dobry den","Buenos días","Buenas","Salut","Servus",
    "Grüezi","Cześć","God morgen","God kveld","Tashi delek","Selam","Sannu","Moni","ສະບາຍດີ","Kia orana",
    "Ia ora na","Malo","Hej hej","Heippa","Здравей","Ćao","Hujambo","Kumusta ka","Slav","Merħba",
    "Բարեւ","Barev","Salom","Сайн байна уу","Kumusta po","Aloha","Muraho","Manao ahoana","Talofa lava","Bon dia"
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
    x: random(40, width - 120),
    y: random(40, height - 80),
    // -3〜3 で 0 を避ける速度
    vx: random([-3, -2, -1, 1, 2, 3]),
    vy: random([-3, -2, -1, 1, 2, 3]),
    // ランダム色（パステル寄り）
    col: color(random(120, 255), random(120, 255), random(120, 255))
  };
}

function draw() {
  background(15, 16, 30);
  noStroke();

  // 各メッセージ処理
  for (let m of messages) {
    const w = textWidth(m.msg);
    // 高さは ascent + descent でやや正確に
    const h = textAscent() + textDescent();

    // 影
    fill(0, 80);
    text(m.msg, m.x + 3, m.y + 3);
    // 本体
    fill(m.col);
    text(m.msg, m.x, m.y);

    // 位置更新
    m.x += m.vx;
    m.y += m.vy;

    // 反射（左右）
    if (m.x < 0) {
      m.x = 0;
      m.vx *= -1;
    } else if (m.x + w > width) {
      m.x = width - w;
      m.vx *= -1;
    }
    // 反射（上下）
    if (m.y < 0) {
      m.y = 0;
      m.vy *= -1;
    } else if (m.y + h > height) {
      m.y = height - h;
      m.vy *= -1;
    }
  }

  // 画面右下に操作ヒント
  fill(255, 140);
  textSize(14);
  const hint = "クリック: 新しいテキスト追加";
  const tw = textWidth(hint);
  text(hint, width - tw - 12, height - 24);
  textSize(fontSize); // 戻す
}

function mousePressed() {
  // マウス位置に新しいメッセージ追加（カウント）
  const label = `Add${messages.length}`;
  const m = createMessage(label);
  m.x = mouseX;
  m.y = mouseY;
  messages.push(m);
}

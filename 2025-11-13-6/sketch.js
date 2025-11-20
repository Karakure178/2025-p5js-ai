// 毛糸をイメージしたアート（GLSLのFBMで歪ませる）
// ふわふわと柔らかい質感を表現

let yarns = []; // 毛糸オブジェクトの配列
const colors = ["#FF6B9D", "#C44569", "#FFC312", "#12CBC4", "#FDA7DF", "#ED4C67"];

// シェーダー関連
let distortShader;
let yarnGraphics; // 毛糸を描画するグラフィックスバッファ

// =====================
// Yarn クラス（毛糸）
// =====================
class Yarn {
  constructor(x, y, targetX, targetY, colorHex) {
    this.startX = x;
    this.startY = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = colorHex;
    this.points = []; // 毛糸の経路ポイント
    this.thickness = random(8, 20); // 毛糸の太さ
    this.fuzziness = random(2, 5); // もふもふ度
    
    // 曲線的な経路を生成
    this.generatePath();
  }

  // 曲線的な経路を生成
  generatePath() {
    const segments = 60; // 滑らかさ
    const controlPoints = [];
    
    // ランダムな制御点を生成（ベジェ曲線用）
    const numControls = int(random(2, 5));
    for (let i = 0; i < numControls; i++) {
      const t = (i + 1) / (numControls + 1);
      const x = lerp(this.startX, this.targetX, t) + randomGaussian(0, 80);
      const y = lerp(this.startY, this.targetY, t) + randomGaussian(0, 80);
      controlPoints.push({ x, y });
    }
    
    // スムーズな曲線を生成
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      let x = lerp(this.startX, this.targetX, t);
      let y = lerp(this.startY, this.targetY, t);
      
      // 制御点の影響を加える
      for (let j = 0; j < controlPoints.length; j++) {
        const influence = sin((j + 1) * t * PI) * 0.3;
        x += (controlPoints[j].x - x) * influence;
        y += (controlPoints[j].y - y) * influence;
      }
      
      this.points.push({ x, y });
    }
  }

  // 毛糸を描画
  display() {
    // 毛糸のもふもふした質感を複数レイヤーで表現
    for (let layer = 0; layer < 8; layer++) {
      const layerOffset = layer * 0.8;
      const layerAlpha = map(layer, 0, 7, 80, 30);
      
      push();
      noFill();
      const c = color(this.color);
      c.setAlpha(layerAlpha);
      stroke(c);
      strokeWeight(this.thickness + layerOffset);
      
      beginShape();
      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i];
        
        // 毛糸のもふもふ感をノイズで表現
        const fuzz = noise(p.x * 0.01, p.y * 0.01, layer * 0.5) * this.fuzziness;
        const angle = noise(p.x * 0.02, p.y * 0.02, layer) * TWO_PI;
        const fuzzX = cos(angle) * fuzz;
        const fuzzY = sin(angle) * fuzz;
        
        curveVertex(p.x + fuzzX, p.y + fuzzY);
      }
      endShape();
      pop();
    }
    
    // 毛糸のハイライト（光沢感）
    push();
    noFill();
    const highlightColor = color(255, 255, 255, 40);
    stroke(highlightColor);
    strokeWeight(this.thickness * 0.3);
    
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      curveVertex(p.x, p.y);
    }
    endShape();
    pop();
  }

  // ランダム生成ヘルパー
  static random() {
    const x = random(width);
    const y = random(height);
    const targetX = random(width);
    const targetY = random(height);
    const yarnColor = random(colors);
    return new Yarn(x, y, targetX, targetY, yarnColor);
  }
}

function preload() {
  // FBMシェーダーを読み込み
  distortShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  // WEBGLモードでキャンバスを作成
  const c = createCanvas(800, 800, WEBGL);
  c.parent("canvas-container");
  
  // 毛糸を描画する2Dグラフィックスバッファ
  yarnGraphics = createGraphics(width, height);
  yarnGraphics.textSize(14);
  
  // 初期の毛糸を生成
  generateYarns();
  
  // FBMアニメーションのためループを有効化
  frameRate(30);
}

// 毛糸をランダムに生成
function generateYarns() {
  yarns = [];
  const numYarns = int(random(8, 15));
  
  for (let i = 0; i < numYarns; i++) {
    yarns.push(Yarn.random());
  }
}

function draw() {
  // まず2Dグラフィックスバッファに毛糸を描画
  yarnGraphics.push();
  yarnGraphics.background(250, 248, 245); // クリーム色の背景
  
  // 全ての毛糸を描画（yarnGraphics上）
  for (const yarn of yarns) {
    // displayメソッドをyarnGraphics用に調整
    drawYarnOnGraphics(yarn, yarnGraphics);
  }
  yarnGraphics.pop();
  
  // WEBGLキャンバスにシェーダーを適用して描画
  shader(distortShader);
  distortShader.setUniform('tex0', yarnGraphics);
  distortShader.setUniform('u_resolution', [width, height]);
  distortShader.setUniform('u_time', millis() / 1000.0);
  
  // 全画面に描画
  push();
  noStroke();
  plane(width, height);
  pop();
}

// yarnGraphics上に毛糸を描画する関数
function drawYarnOnGraphics(yarn, g) {
  // 毛糸のもふもふした質感を複数レイヤーで表現
  for (let layer = 0; layer < 8; layer++) {
    const layerOffset = layer * 0.8;
    const layerAlpha = map(layer, 0, 7, 80, 30);
    
    g.push();
    g.noFill();
    const c = color(yarn.color);
    c.setAlpha(layerAlpha);
    g.stroke(c);
    g.strokeWeight(yarn.thickness + layerOffset);
    
    g.beginShape();
    for (let i = 0; i < yarn.points.length; i++) {
      const p = yarn.points[i];
      
      // 毛糸のもふもふ感をノイズで表現
      const fuzz = noise(p.x * 0.01, p.y * 0.01, layer * 0.5) * yarn.fuzziness;
      const angle = noise(p.x * 0.02, p.y * 0.02, layer) * TWO_PI;
      const fuzzX = cos(angle) * fuzz;
      const fuzzY = sin(angle) * fuzz;
      
      g.curveVertex(p.x + fuzzX, p.y + fuzzY);
    }
    g.endShape();
    g.pop();
  }
  
  // 毛糸のハイライト（光沢感）
  g.push();
  g.noFill();
  const highlightColor = color(255, 255, 255, 40);
  g.stroke(highlightColor);
  g.strokeWeight(yarn.thickness * 0.3);
  
  g.beginShape();
  for (let i = 0; i < yarn.points.length; i++) {
    const p = yarn.points[i];
    g.curveVertex(p.x, p.y);
  }
  g.endShape();
  g.pop();
}

// クリックで毛糸を追加
function mousePressed() {
  // WEBGLの座標系（中心が原点）から通常座標系に変換
  const mx = mouseX - width / 2 + width / 2;
  const my = mouseY - height / 2 + height / 2;
  
  // ランダムな始点からクリック位置へ毛糸を伸ばす
  const startX = random(width);
  const startY = random(height);
  const yarnColor = random(colors);
  
  yarns.push(new Yarn(startX, startY, mx, my, yarnColor));
}

// キーボード操作
function keyPressed() {
  if (key === 'r' || key === 'R') {
    // 再生成
    generateYarns();
  } else if (key === 'c' || key === 'C') {
    // クリア
    yarns = [];
  }
}

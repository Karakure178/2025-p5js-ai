const bgColors = ["#1C1C20", "#F3E2D4"];
let mainGray, subGray, navyR, navyG, navyB;
let num = 1;
let canvas;

// シックでシンプルな静止画 - モダンミニマル
function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  colorMode(RGB, 255);
  mainGray = [random(240, 250), random(10, 20)];
  subGray = [random(60, 75), random(165, 180)];
  navyR = [random(20, 35), random(205, 220)];
  navyG = [random(30, 45), random(195, 210)];
  navyB = [random(45, 65), random(170, 190)];
  num = floor(random(0, bgColors.length));
  theShader1 = createFilterShader(shader1.fs);
  // 一度だけ描画
  noLoop();
}

function draw() {
  translate(-width / 2, -height / 2);
  // 深いチャコールグレーの背景
  background(bgColors[num]);

  // メインの構成要素
  drawMinimalComposition();

  // アクセントライン
  drawAccentLines();

  // 幾何学的要素
  drawGeometricElements();

  // テクスチャの追加
  addSubtleTexture();

  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, canvas);
    theShader1.setUniform("u_resolution", [canvas.width, canvas.height]);
    theShader1.setUniform(`u_time`, -frameCount / 35);
    filter(theShader1);
  };

  shaderImage();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function drawMinimalComposition() {
  push();

  // ランダムな配置の基準点
  let goldenRatio = 1.618;
  let centerX = width / 2 + random(-50, 50);
  let centerY = height / 2 + random(-30, 30);

  // メインの長方形 - ランダムな変化
  // let mainGray = random(240, 250);
  fill(mainGray[num], mainGray[num], mainGray[num] - random(0, 5));
  noStroke();
  let mainWidth = width * random(0.35, 0.45);
  let mainHeight = mainWidth / (goldenRatio + random(-0.1, 0.1));
  let mainRotation = random(-0.05, 0.05);

  push();
  translate(centerX, centerY - 60 + random(-20, 20));
  rotate(mainRotation);
  rect(-mainWidth / 2, -mainHeight / 2, mainWidth, mainHeight);
  pop();

  // サブ要素 - ランダムな配置とサイズ
  fill(subGray[num], subGray[num], subGray[num] + random(0, 10));
  let subWidth = width * random(0.12, 0.18);
  let subHeight = subWidth * (goldenRatio + random(-0.2, 0.2));
  let subX = centerX + mainWidth / 3 + random(-30, 30);
  let subY = centerY + 40 + random(-25, 25);
  rect(subX, subY, subWidth, subHeight);

  // アクセント - ランダムな色と配置
  fill(navyR[num], navyG[num], navyB[num]);
  let accentSize = random(35, 50);
  let accentX = centerX - mainWidth / 2 + random(10, 30);
  let accentY = centerY - mainHeight / 2 - 40 + random(-15, 15);

  // 時々円形にする
  if (random() > 0.7) {
    ellipse(
      accentX + accentSize / 2,
      accentY + accentSize / 2,
      accentSize,
      accentSize
    );
  } else {
    rect(accentX, accentY, accentSize, accentSize);
  }

  pop();
}

function drawAccentLines() {
  push();

  // ランダムなライン配置
  let numLines = floor(random(3, 7));

  for (let i = 0; i < numLines; i++) {
    // ランダムな太さと色
    let weight = random() > 0.6 ? random(1, 3) : random(0.5, 1.5);
    strokeWeight(weight);

    let gray = random(120, 190);
    stroke(gray, gray, gray - random(0, 10));

    // ランダムな方向のライン
    if (random() > 0.5) {
      // 水平線
      let y = random(height * 0.2, height * 0.8);
      let x1 = random(width * 0.1, width * 0.3);
      let x2 = random(width * 0.6, width * 0.9);
      line(x1, y, x2, y);
    } else {
      // 垂直線
      let x = random(width * 0.2, width * 0.8);
      let y1 = random(height * 0.1, height * 0.4);
      let y2 = random(height * 0.6, height * 0.9);
      line(x, y1, x, y2);
    }
  }

  // 時々斜めのラインも追加
  if (random() > 0.7) {
    strokeWeight(random(0.5, 2));
    let gray = random(100, 150);
    stroke(gray, gray, gray);

    let x1 = random(width * 0.1, width * 0.5);
    let y1 = random(height * 0.1, height * 0.5);
    let x2 = x1 + random(50, 200);
    let y2 = y1 + random(-100, 100);
    line(x1, y1, x2, y2);
  }

  pop();
}

function drawGeometricElements() {
  push();

  // ランダムな数の幾何学要素
  let numElements = floor(random(2, 6));

  for (let i = 0; i < numElements; i++) {
    let x = random(width * 0.1, width * 0.9);
    let y = random(height * 0.1, height * 0.9);
    let size = random(15, 100);

    // ランダムな色（シックな範囲で）
    let r, g, b;
    if (random() > 0.6) {
      // ベージュ系
      let base = random(200, 230);
      r = base;
      g = base - random(5, 15);
      b = base - random(10, 25);
    } else {
      // グレー系
      let gray = random(40, 80);
      r = gray;
      g = gray + random(0, 10);
      b = gray + random(5, 20);
    }

    fill(r, g, b);
    noStroke();

    // ランダムな形状
    let shapeType = random();
    if (shapeType < 0.4) {
      // 円
      ellipse(x, y, size, size);
    } else if (shapeType < 0.7) {
      // 正方形/長方形
      let w = size;
      let h = random() > 0.5 ? size : size * random(0.3, 0.8);
      rect(x - w / 2, y - h / 2, w, h);
    } else {
      // 三角形
      let offset = size * 0.5;
      triangle(
        x,
        y - offset,
        x - offset * random(0.7, 1.2),
        y + offset,
        x + offset * random(0.7, 1.2),
        y + offset
      );
    }
  }

  // 時々小さな点の群れを追加
  if (random() > 0.5) {
    let numDots = floor(random(5, 15));
    let centerX = random(width * 0.2, width * 0.8);
    let centerY = random(height * 0.2, height * 0.8);

    for (let i = 0; i < numDots; i++) {
      let dotX = centerX + random(-60, 60);
      let dotY = centerY + random(-60, 60);
      let dotSize = random(2, 8);

      let gray = random(60, 120);
      fill(gray, gray, gray + random(0, 20));
      ellipse(dotX, dotY, dotSize, dotSize);
    }
  }

  pop();
}

function addSubtleTexture() {
  push();

  // ランダムな密度のノイズテクスチャ
  let noiseAmount = floor(random(500, 1500));
  for (let i = 0; i < noiseAmount; i++) {
    let x = random(width);
    let y = random(height);

    // ランダムな明暗のドット
    let alpha = random(3, 12);
    if (random() > 0.5) {
      fill(255, 255, 255, alpha); // 白い微細な点
    } else {
      fill(0, 0, 0, alpha); // 黒い微細な点
    }
    noStroke();
    let dotSize = random() > 0.8 ? random(0.5, 2) : 1;
    ellipse(x, y, dotSize, dotSize);
  }

  // ランダムな紙のような質感
  let paperLines = floor(random(20, 80));
  for (let i = 0; i < paperLines; i++) {
    let x = random(width);
    let y = random(height);
    let w = random(5, 50);
    let h = random(0.5, 4);

    // ランダムな方向
    let angle = random(TWO_PI);

    push();
    translate(x, y);
    rotate(angle);

    let alpha = random(2, 8);
    fill(255, 255, 255, alpha);
    noStroke();
    rect(-w / 2, -h / 2, w, h);
    pop();
  }

  // 時々大きな薄いシェイプを追加
  if (random() > 0.6) {
    let numShapes = floor(random(1, 4));
    for (let i = 0; i < numShapes; i++) {
      let x = random(width);
      let y = random(height);
      let size = random(50, 200);

      let alpha = random(2, 6);
      if (random() > 0.5) {
        fill(255, 255, 255, alpha);
      } else {
        fill(0, 0, 0, alpha);
      }
      noStroke();

      if (random() > 0.5) {
        ellipse(x, y, size, size * random(0.3, 1.2));
      } else {
        rect(x - size / 2, y - size / 2, size, size * random(0.2, 0.8));
      }
    }
  }

  pop();
}

// マウスクリックで微細な変更
function mousePressed() {
  redraw();
}

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
uniform float u_time;
uniform vec2 u_resolution;

float pi=3.14159265358979;

// ボロノイ図をUVの値につかう
float rand(vec2 x){
  return fract(cos(mod(dot(x,vec2(13.9898,8.141)),3.14))*43758.5453);
}

vec2 rand2(vec2 x){
  return fract(cos(mod(vec2(dot(x,vec2(13.9898,8.141)),
  dot(x,vec2(3.4562,17.398))),vec2(3.14)))*43758.5453);
}

// Based on https://www.shadertoy.com/view/ldl3W8
// The MIT License
// Copyright © 2013 Inigo Quilez
vec3 iq_voronoi(vec2 x,vec2 size,vec2 stretch,float randomness,vec2 seed){
  vec2 n=floor(x);
  vec2 f=fract(x);
  
  vec2 mg,mr,mc;
  float md=8.;
  for(int j=-1;j<=1;j++)
  for(int i=-1;i<=1;i++){
    vec2 g=vec2(float(i),float(j));
    vec2 o=randomness*rand2(seed+mod(n+g+size,size));
    vec2 c=g+o;
    vec2 r=c-f;
    vec2 rr=r*stretch;
    float d=dot(rr,rr);
    
    if(d<md){
      mc=c;
      md=d;
      mr=r;
      mg=g;
    }
  }
  
  md=8.;
  for(int j=-2;j<=2;j++)
  for(int i=-2;i<=2;i++){
    vec2 g=mg+vec2(float(i),float(j));
    vec2 o=randomness*rand2(seed+mod(n+g+size,size));
    vec2 r=g+o-f;
    vec2 rr=(mr-r)*stretch;
    if(dot(rr,rr)>.00001)
    md=min(md,dot(.5*(mr+r)*stretch,normalize((r-mr)*stretch)));
  }
  
  return vec3(md,mc+n);
}

vec4 voronoi(vec2 uv,vec2 size,vec2 stretch,float intensity,float randomness,float seed){
  uv*=size;
  vec3 v=iq_voronoi(uv,size,stretch,randomness,rand2(vec2(seed,1.-seed)));
  return vec4(v.yz,intensity*length((uv-v.yz)*stretch),v.x);
}

const float scale_x=10.;
const float scale_y=10.;
const float stretch_x=1.62;
const float stretch_y=1.;
const float intensity=1.;
const float randomness=.85;

  float random(vec2 c){
    return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

void main(){
  vec2 uv=vTexCoord;
  
  float minSize=min(u_resolution.x,u_resolution.y);
  vec4 voronoiColor=voronoi((uv),vec2(scale_x,scale_y),vec2(stretch_y,stretch_x),intensity,randomness,0.);
  float celler=voronoiColor.z;
  
  // fractでリピートできる
  vec4 tex=texture2D(u_tex,fract((uv+(celler*0.02))));
	
	float interval = 1.0;
  float strength = smoothstep(interval * 0.5, interval, interval - mod(u_time, interval));
  float whiteNoise = (random(uv + mod(u_time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

  //vec4 tex = texture2D(u_tex, uv);
  gl_FragColor = tex + whiteNoise;
}
`,
};

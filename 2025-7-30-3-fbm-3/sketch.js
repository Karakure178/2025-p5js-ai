const colors = [
  "#5EABD6",
  "#FFB4B4",
  "#E14434",
  "#03A6A1",
  "#FFA673",
  "#FF4F0F",
  "#FFD66B",
];
let colorSelect = [];
let num = 10;
let pg;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  rectMode(CENTER);
  pg = createGraphics(800, 800);
  pg.noStroke();
  theShader1 = createFilterShader(shader1.fs);
  for (let i = 0; i < num; i++) {
    colorSelect.push([]);
    for (let j = 0; j < num; j++) {
      colorSelect[i].push(random(colors));
    }
  }
  background(255);
}

function draw() {
  translate(-width / 2, -height / 2);
  background(255);
  pg.clear();
  pg.background(255);

  grid(pg, num, colorSelect);

  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, pg);
    theShader1.setUniform(`u_time`, frameCount / 35);
    filter(theShader1);
  };

  image(pg, 0, 0);
  shaderImage();
}

keyPressed = () => {
  if (key === "s") {
    saveCanvas(canvas, "canvas", "png");
    //saveGif('canvas', 2);
  }
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/** num個で分割したグリッドを画面いっぱいに生成する
 * @method grid
 * @param  {Number}        num           画面の分割数
 */
const grid = (pg, num, colors) => {
  const n1 = num + 1;

  const margin_left = width / n1 / n1;
  const margin_bottom = height / n1 / n1;

  const nw = width / n1;
  const nh = height / n1;

  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      const x = nw * i + margin_left * (i + 1);
      const y = nh * j + margin_bottom * (j + 1);
      pg.fill(colors[i][j]);
      pg.circle(x + nw / 2, y + nw / 2, nw);
    }
  }
};

const shader1 = {
  fs: `
precision highp float;
precision highp int;

varying vec2 vTexCoord;

uniform sampler2D u_tex;
uniform float u_time;

float pi = 3.14159265358979;

// ノイズ関数
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// フラクタルノイズ（fbm）
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

float random(vec2 c) {
    return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vTexCoord;
    
    // シンプルなオイルペイント風の効果
    vec3 finalColor = vec3(0.0);
    float totalWeight = 0.0;
    
    // 適度な範囲でサンプリング
    for (int i = -2; i <= 2; i++) {
        for (int j = -2; j <= 2; j++) {
            vec2 offset = vec2(float(i), float(j)) / 800.0;
            
            // 軽い歪み効果
            float distortion = fbm(uv * 5.0 + u_time * 0.02) * 0.005;
            vec2 sampleUV = uv + offset + vec2(distortion, distortion * 0.8);
            
            vec4 sampleColor = texture2D(u_tex, sampleUV);
            
            // 距離に基づく重み
            float distance = length(offset);
            float weight = exp(-distance * 12.0);
            
            // 色の類似度による重み（軽く）
            vec4 centerColor = texture2D(u_tex, uv);
            float colorSimilarity = 1.0 - length(sampleColor.rgb - centerColor.rgb) * 0.5;
            weight *= colorSimilarity;
            
            finalColor += sampleColor.rgb * weight;
            totalWeight += weight;
        }
    }
    
    finalColor /= totalWeight;
    
    // 軽いブラシテクスチャ
    float brushTexture = fbm(uv * 15.0) * 0.9;
    finalColor += brushTexture;

    
    // 適度な彩度向上
    float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
    finalColor = mix(vec3(luminance), finalColor, 1.1);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`,
};

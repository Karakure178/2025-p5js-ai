const colors = [];
const colorSelect = ["#FF7A30", "#465C88", "#000000"];
let numShapes = 10;
let canvas;

function setup() {
  canvas = createCanvas(800, 800, WEBGL);
  rectMode(CENTER);
  noStroke();
  fill(0);
  for (let i = 0; i < numShapes; i++) {
    colors.push([]);
    for (let j = 0; j < numShapes; j++) {
      colors[i].push(random(colorSelect));
    }
  }
  theShader1 = createFilterShader(shader1.fs);
}

function draw() {
  background("#EEEEEE");
  translate(-width / 2, -height / 2);

  let spacing = min(width, height) / numShapes;

  for (let i = 0; i < numShapes; i++) {
    for (let j = 0; j < numShapes; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      let d = dist(width / 2, height / 2, x, y);
      let size = map(
        sin(d * 0.05 + frameCount * 0.05),
        -1,
        1,
        spacing * 0.2,
        spacing * 1.2
      );

      push();
      translate(x, y);
      rotateX(frameCount * 0.01);
      rotateY(frameCount * 0.01);
      fill(colors[i][j]);
      rect(0, 0, size, size);
      pop();
    }
  }

  const shaderImage = () => {
    theShader1.setUniform(`u_tex`, canvas);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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

   float pi = 3.14159265358979;

   void main() {

      vec2 uv = vTexCoord;
      uv.x += 0.02 * cos(uv.y*pi*5.0 + u_time);
      vec4 tex = texture2D(u_tex, uv);

      gl_FragColor = tex;
    }
`,
};

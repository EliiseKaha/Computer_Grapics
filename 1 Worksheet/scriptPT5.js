window.onload = function init()
{
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);


  var vertices = [vec2(0.0, 0.0)];
  var color = [vec4(1.0,  1.0,  1.0,  1.0)];
  var r=0.5;
  var n=36;
  for(let i=0.0; i<=n; i++) {
    var angle=(2*Math.PI*i)/n;
    var a=vec2(r*Math.sin(angle),r*Math.cos(angle));

    vertices.push(a);
    color.push(vec4(1.0,  1.0,  1.0,  1.0));
  }

  var vBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var cBuffer= gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
  var cPosition = gl.getAttribLocation(program, "a_Color");
  gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(cPosition);

  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, n+2);

  var betaLoc = gl.getUniformLocation(program, "beta");
  var beta = Math.PI/2;
  tick();

  function render(n) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    beta += 0.01;
    gl.uniform1f(betaLoc, beta);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  }
function tick() {
  render(n+2);
  requestAnimationFrame(tick);

}

}

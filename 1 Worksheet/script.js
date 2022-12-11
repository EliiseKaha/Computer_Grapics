window.onload = function init()
{
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");
  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var vBuffer = gl.createBuffer();
  var cBuffer= gl.createBuffer();;
  var vertices = [vec2(0.0,0.0)];
  var color = [vec4(1.0,  0.0,  1.0,  1.0)];
  var r=0.5;
  var n=200;
  for(var i=0.0; i<=n; ++i) {
    var angle=(2*Math.PI*i)/n
    var a=vec2(r*Math.cos(angle),r*Math.cos(angle))

    vertices.push(a)
    color.push(vec4(1.0,  0.0,  1.0,  1.0));
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);


  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
  var cPosition = gl.getAttribLocation(program, "a_Color");
  gl.vertexAttribPointer(cPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(cPosition);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n+2);

  //var ANGLE_STEP = 45.0;
  //var currentAngle = 0.0;
  //var modelMatrix = mat4();
  //var u_ModelMatrix=gl.getUniformLocation(program, "u_ModelMatrix");



  //var tick = function() {
    //currentAngle = animate(currentAngle);
    //draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
    //requestAnimationFrame(tick);
  //};
  //tick();


  //function draw(gl,n, currentAngle, modelMatrix, u_ModelMatrix){
    //modelMatrix=rotate(currentAngle, vec3(0, 0, 1));
    //gl.uniformMatrix4fv( u_ModelMatrix, false, flatten(modelMatrix))
    //gl.uniform4f( u_ModelMatrix, false, modelMatrix.elements);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
//  };

  //var g_last = Date.now();

  //function animate(angle) {
    //return angle+0.9
//  };

}

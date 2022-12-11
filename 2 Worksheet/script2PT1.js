window.onload = function init()
{
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");

  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var index = 0;
  var max_verts=1000;
  var numPoint=0;
  var vertices = [];
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, max_verts*sizeof['vec2'], gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  canvas.addEventListener("click", function(ev) {
    console.log("yes")
    var box=event.target.getBoundingClientRect();
    var mousepose = vec2(2*(ev.clientX-box.left)/canvas.width-1,
    2*(canvas.height-ev.clientY+box.top)/canvas.height-1);
    gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(mousepose));
    numPoint=Math.max(numPoint,++index);
    render();
  })


  function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, index);
    requestAnimFrame(render);
  }
}

window.onload = function init()
{
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  var menu = document.getElementById("colorMenu");
  var clearMenu = document.getElementById("clearMenu");
  var clearButton = document.getElementById("clearButton");

  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var index = 0;
  var max_verts=1000;
  var numPoint=0;
  var t=vec4(0.0, 0.0, 0.0, 1.0);
  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, max_verts*sizeof['vec2'], gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var colors = [
   vec4(0.0, 0.0, 0.0, 1.0),  // black
   vec4(1.0, 0.0, 0.0, 1.0), //red
   vec4(0.0, 1.0, 0.0, 1.0), //green
   vec4(0.0, 0.0, 1.0, 1.0), //blue
   vec4(1.0, 1.0, 0.0, 1.0), //yellow
   vec4(1.0, 0.0, 1.0, 1.0), //purple
   vec4(0.0, 1.0, 1.0, 1.0), //light blue
   vec4(1.0, 1.0, 1.0, 1.0)]//white


  clearButton.addEventListener("click", function(ev) {
    console.log(clearMenu.selectedIndex)
      var bgcolor = colors[clearMenu.selectedIndex]
      console.log(bgcolor)
      gl.clearColor(bgcolor[0], bgcolor[1], bgcolor[2], bgcolor[3]);
      gl.clear(gl.COLOR_BUFFER_BIT);
      index=0;
      numPoint=0;
    });

    var cBuffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, max_verts*sizeof['vec4'], gl.STATIC_DRAW);
    var cPosition = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cPosition);

    menu.addEventListener("change", function(ev) {
      console.log("good")
      cIndex = menu.selectedIndex;
      t = vec4(colors[cIndex]);
    })

    canvas.addEventListener("click", function(ev) {
      console.log("yes")

      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      var box=event.target.getBoundingClientRect();
      var mousepose = vec2(2*(ev.clientX-box.left)/canvas.width-1,
      2*(canvas.height-ev.clientY+box.top)/canvas.height-1);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(mousepose));

      gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*index, flatten(t));

      numPoint=Math.max(numPoint,++index);
      render();
    })

    function render(){
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, index);
      requestAnimFrame(render);
    }

}

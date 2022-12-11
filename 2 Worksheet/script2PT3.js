window.onload = function init()
{
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");
  var menu = document.getElementById("colorMenu");
  var clearMenu = document.getElementById("clearMenu");
  var clearButton = document.getElementById("clearButton");
  var pointButton = document.getElementById("pointButton");
  var triangleButton= document.getElementById("triangleButton");

  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var index = 0;
  var triangles=0;
  var max_verts=1000;
  var numPoint=0;
  var points=[];
  var triangle=[];
  var triangleIndex=[];
  var pointsIndex=[];

  var t=vec4(0.0, 0.0, 0.0, 1.0);
  var mode=0;

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
    triangles=0;
    triangleIndex=[];
    pointsIndex=[];
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

  pointButton.addEventListener("click", function(ev) {
    mode=0;
  })

  triangleButton.addEventListener("click", function(ev){
    mode=1;
  })

  canvas.addEventListener("click", function(ev) {
    console.log("yes")
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    var box=event.target.getBoundingClientRect();
    var mousepose = vec2(2*(ev.clientX-box.left)/canvas.width-1,
    2*(canvas.height-ev.clientY+box.top)/canvas.height-1);

      if(mode==0){

        points.push(mousepose);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(mousepose));

        pointsIndex.push(index);

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*index, flatten(t));

        }
      else if(mode==1){

        triangle.push(mousepose);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2'] * index, flatten(mousepose));
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4'] * index, flatten(t));

          if (triangles == 2){

            pointsIndex.pop();
            triangleIndex.push(pointsIndex[pointsIndex.length - 1]);
            pointsIndex.pop();

            triangles=0;}

          else{
            pointsIndex.push(index);
            triangles++;
          }
      }
      numPoint=Math.max(numPoint,++index);
  })
  render();

  function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (var i = 0; i < index; i++) {
      if (pointsIndex.includes(i)) {
        gl.drawArrays(gl.POINTS, i, 1);
      } else if (triangleIndex.includes(i)) {
        gl.drawArrays(gl.TRIANGLES, i, 3);
    }
  }
    requestAnimFrame(render);}

}

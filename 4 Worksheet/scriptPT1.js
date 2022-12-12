function call(){
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");
  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
  ];

  var va = vec4(0.0, 0.0, 1.0, 1);
  var vb = vec4(0.0, 0.942809, -0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
  var vd = vec4(0.816497, -0.471405, -0.333333, 1);

  var pointsArray=[];

  function tetrahedron(a, b, c, d, n){
    divideTriangle(a, b, c, n);
    divideTriangle(d, c, b, n);
    divideTriangle(a, d, b, n);
    divideTriangle(a, c, d, n);
  }



  tetrahedron(va, vb, vc, vd, numSubdivs);


  function divideTriangle(a, b, c, count){
    if (count > 0) {
      var ab = normalize(mix(a, b, 0.5), true);
      var ac = normalize(mix(a, c, 0.5), true);
      var bc = normalize(mix(b, c, 0.5), true);
      divideTriangle(a, ab, ac, count - 1);
      divideTriangle(ab, b, bc, count - 1);
      divideTriangle(bc, c, ac, count - 1);
      divideTriangle(ab, bc, ac, count - 1);
    }
    else {
      triangle(a, b, c);
  }
  }

  function triangle(a, b, c) {
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);
  }


  gl.vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);


  var VLoc=gl.getUniformLocation(program, "u_ModelMatrix");
  var PLoc = gl.getUniformLocation(program, "u_ProjectionMatrix");


  var V = lookAt(vec3(0.0, 0.0, 5.0),vec3(0.0,0.0,-10.0), vec3(0.0,1.0,0.0));
  var P = perspective(45.0, 1.0, 0.1, 100.0);

  gl.uniformMatrix4fv(VLoc, false, flatten(V));
  gl.uniformMatrix4fv(PLoc, false, flatten(P));

  render();

  function render(){
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    for(var i = 0; i < pointsArray.length ; i=i+3){
      gl.drawArrays(gl.TRIANGLES, i, 3);
    }
    requestAnimFrame(render);
  }
}


var numSubdivs= 0;
var upButton= document.getElementById("subdivisionUp");
var downButton= document.getElementById("subdivisionDown");

upButton.addEventListener("click", function(ev){
  console.log("yes")
  numSubdivs=numSubdivs+1;
  call();
})

downButton.addEventListener("click", function(ev){
  console.log("no")
  numSubdivs=numSubdivs-1;
  call();
})

window.onload= function init()
{
call();
}

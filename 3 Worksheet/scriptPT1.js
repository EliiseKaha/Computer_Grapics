window.onload = function init()
{
var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl");
gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

var program = initShaders(gl, "vertex-shader", "fragment-shader");
gl.useProgram(program);

var vertices = [
  -0.5, -0.5,  0.5,//0
  -0.5,  0.5,  0.5,//1
  0.5,  0.5,  0.5,//2
  0.5, -0.5,  0.5,//3
  -0.5, -0.5, -0.5,//4
  -0.5,  0.5, -0.5,//5
  0.5,  0.5, -0.5,//6
  0.5, -0.5, -0.5//7
];

/*var indices = [
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
];*/

var indices=[
  0,1,
  1,2,
  2,3,
  3,7,
  7,4,
  4,0,
  0,3,
  2,6,
  6,5,
  5,1,
  2,6,
  6,7,
  4,5];


var vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
var vPosition = gl.getAttribLocation(program, "a_Position");
gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

var iBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);

var VLoc=gl.getUniformLocation(program, "u_ModelMatrix");
//var V = lookAt(vec3(0.0, 0.0, 0.0),vec3(1.0,1.0,1.0), vec3(0.0,1.0,0.0));
var V = lookAt(vec3(0.0, 0.0, 0.0),vec3(0.5,1.0,0.5), vec3(0.0,1.0,0.0));

//var I = mat4(
  //1, 0, 0, 0,
//  0, 1, 0, 0,
  //0, 0, 1, 0,
  //0, 0, 0, 1); // identity matrix
//var R = rotate(angle, direction);
//var Rx = rotateX(angle);
//var Rz = rotateZ(angle);
//var S = scalem(s_x, s_y, s_z);
//var T = translate(t_x, t_y, t_z);
//var c = mult(a, b);

gl.uniformMatrix4fv(VLoc, false, flatten(V));

gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);


//var color = [
  //vec4(0.0, 1.0,  0.0, 1.0),
  //vec4(0.0, 1.0,  0.0, 1.0),
  //vec4(0.0, 1.0,  0.0, 1.0),
  //vec4(0.0, 1.0,  0.0, 1.0),
  //vec4(0.0, 1.0,  0.0, 1.0),
  //vec4(0.0, 1.0,  0.0, 1.0),
  //vec4(0.0, 1.0,  0.0, 1.0),
  //vec4(0.0, 1.0,  0.0, 1.0)
//];
//var cBuffer= gl.createBuffer();
//gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
//gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
//var cPosition = gl.getAttribLocation(program, "a_Color");
//gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
//gl.enableVertexAttribArray(cPosition);
}

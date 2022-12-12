window.onload= function init(){
  var canvas = document.getElementById("c");
  var gl = canvas.getContext("webgl");
  gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  var cameraButton= document.getElementById("camera");
  var camera=1;
  cameraButton.addEventListener("click", function(ev){
    console.log("better");
    if (camera==1){
      camera=0;
    }
    else{
      camera=1;
    }
  })

var numSubdivs= 6;


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
  var normalsArray=[];
  var texCoordsArray=[];
  var color=[];

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
      triangle(a, b, c, count);
  }
  }

  function triangle(a, b, c, colors) {
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);

    normalsArray.push(vec4(a[0], a[1], a[2], 0.0));
    normalsArray.push(vec4(b[0], b[1], b[2], 0.0));
    normalsArray.push(vec4(c[0], c[1], c[2], 0.0));

    texCoordsArray.push(vec2(1-(Math.atan2(a[2],a[0])/(2*Math.PI)),(Math.acos(a[1])/Math.PI)))
    texCoordsArray.push(vec2(1-(Math.atan2(b[2],b[0])/(2*Math.PI)),(Math.acos(b[1])/Math.PI)))
    texCoordsArray.push(vec2(1-(Math.atan2(c[2],c[0])/(2*Math.PI)),(Math.acos(c[1])/Math.PI)))
  }


  gl.vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);


  //var cBuffer= gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  //gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
  //var cPosition = gl.getAttribLocation(program, "a_Color");
  //gl.vertexAttribPointer(cPosition, 4, gl.FLOAT, false, 0, 0);
  //gl.enableVertexAttribArray(cPosition);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
  var vNormal = gl.getAttribLocation(program, "a_Normal");
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal);

  var tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
  var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
  gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vTexCoord);

  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);

  var beta=0.0;
  var radius=3.0;
  var eye=vec3(radius*Math.cos(beta), 0.0, radius*Math.sin(beta));

  var VLoc=gl.getUniformLocation(program, "u_ModelMatrix");
  var PLoc = gl.getUniformLocation(program, "u_ProjectionMatrix");

  var P = perspective(45.0, 1.0, 0.1, 100.0);
  var V = lookAt(eye,vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));

  gl.uniformMatrix4fv(PLoc, false, flatten(P));
  gl.uniformMatrix4fv(VLoc, false, flatten(V));

  var DLoc=gl.getUniformLocation(program, "diffuseProduct");
  var LLoc = gl.getUniformLocation(program, "lightPosition");

  var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  var lightPosition = vec4(1.0, 0.0, 1.0, 0.0);
  var kd= vec4(1.0, 1.0, 1.0, 1.0);

  var diffuseProduct = mult(lightDiffuse, kd);

  gl.uniform4fv(DLoc, flatten(diffuseProduct));
  gl.uniform4fv(LLoc, flatten(lightPosition));

  var image = document.createElement('img');
    image.crossorigin = 'anonymous';
    image.onload = function () {
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.generateMipmap(gl.TEXTURE_2D);
      //Mipmap should deffinently be used cause without some textures such as mountaind will be very pixeled
      //(gl.LINEAR_MIPMAP_LINEAR) because it is most versatile using both the best mipmap and
      //nearest filtering between mipmaps
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.uniform1i(gl.getUniformLocation(program, "texMap"),0);
    };
    image.src = 'earth.jpg';

 function render(){
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    for(var i = 0; i < pointsArray.length ; i=i+3){
      gl.drawArrays(gl.TRIANGLES, i, 3);
    }
    if (camera == 1){
    beta += 0.01;
    eye = vec3(radius*Math.cos(beta), 0.0, radius*Math.sin(beta));
    VLoc=gl.getUniformLocation(program, "u_ModelMatrix");
    V = lookAt(eye,vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));
    gl.uniformMatrix4fv(VLoc, false, flatten(V));}
    requestAnimFrame(render);
  }
   render();
}


/*var numSubdivs= 6;
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
})*/

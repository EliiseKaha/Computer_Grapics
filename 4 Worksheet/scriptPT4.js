function call(){
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

  }


  gl.vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "a_Position");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
  var vNormal = gl.getAttribLocation(program, "a_Normal");
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vNormal)


  var iBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);

  var beta=0.0;
  var radius=4.0;
  var eye=vec3(radius*Math.cos(beta), 0.0, radius*Math.sin(beta));

  var VLoc=gl.getUniformLocation(program, "u_ModelMatrix");
  var PLoc = gl.getUniformLocation(program, "u_ProjectionMatrix");

  var P = perspective(45.0, 1.0, 0.1, 100.0);
  var V = lookAt(eye,vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));

  gl.uniformMatrix4fv(PLoc, false, flatten(P));
  gl.uniformMatrix4fv(VLoc, false, flatten(V));

  //var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
  //var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
  //var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
  var lightPosition = vec4(0.0, 0.0, 1.0, 0.0);

  //var materialDiffuse= vec4(1.0, 0.8, 0.0, 1.0);
  //var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
  //var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);


  var emission=1.0;
  var materialShininess=100.0;


  var diffuseProduct = 0.5;
  var ambientProduct =0.5;
  var specularProduct =0.5;

  //var diffuseProduct = mult(lightDiffuse, materialDiffuse);
  //var ambientProduct = mult(lightAmbient, materialAmbient);
  //var specularProduct = mult(lightSpecular, materialSpecular);
  //gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct));
  //gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
  //gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));

  gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
  gl.uniform1f(gl.getUniformLocation(program, "emission"),emission)
  gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);
  gl.uniform1f(gl.getUniformLocation(program, "diffuseProduct"),diffuseProduct);
  gl.uniform1f(gl.getUniformLocation(program, "ambientProduct"),ambientProduct);
  gl.uniform1f(gl.getUniformLocation(program, "specularProduct"),specularProduct);

  var sLabel = document.getElementById("sLabel")
  sLabel.innerHTML = 100.0;
  var shininessslider=document.getElementById("sslide").oninput	 =
    function() {
      var s = parseFloat(event.srcElement.value);
      sLabel.innerHTML = s;
      gl.uniform1f(gl.getUniformLocation(program, "shininess"),s);};


  var dLabel = document.getElementById("dLabel")
  dLabel.innerHTML = 0.5;
  var kdslider=document.getElementById("kdslide").oninput =
    function() {
      var d = parseFloat(event.srcElement.value);
      dLabel.innerHTML = d;
      gl.uniform1f(gl.getUniformLocation(program, "diffuseProduct"),d);};

  var ksLabel = document.getElementById("ksLabel")
  ksLabel.innerHTML = 0.5;
  var ksslider=document.getElementById("ksslide").oninput =
    function() {
      var ks = parseFloat(event.srcElement.value);
      ksLabel.innerHTML = ks;
      gl.uniform1f(gl.getUniformLocation(program, "specularProduct"),ks);};


  var aLabel = document.getElementById("aLabel")
  aLabel.innerHTML = 0.5;
  var kaslider=document.getElementById("kaslide").oninput =
    function() {
      var a = parseFloat(event.srcElement.value);
      aLabel.innerHTML = a;
      gl.uniform1f(gl.getUniformLocation(program, "ambientProduct"),a);};

    var LeLabel = document.getElementById("LeLabel")
    LeLabel.innerHTML = 0.5;
    var Leslider=document.getElementById("Leslide").oninput =
      function() {
        var le = parseFloat(event.srcElement.value);
        LeLabel.innerHTML = le;
        gl.uniform1f(gl.getUniformLocation(program, "emission"),le);};


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


var numSubdivs= 6;
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

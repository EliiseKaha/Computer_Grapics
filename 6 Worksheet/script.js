window.onload = function init()
{
var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl");
gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

var program = initShaders(gl, "vertex-shader", "fragment-shader");
gl.useProgram(program);

var vertices = [vec3(-4.0, -1.0, -1.0),
    vec3(4.0, -1.0, -1.0),
    vec3(4.0, -1.0, -21.0),
    vec3(-4.0, -1.0, -21.0)]
var vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
var vPosition = gl.getAttribLocation(program, "a_Position");
gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

 var PLoc = gl.getUniformLocation(program, "u_ProjectionMatrix");
 var P = perspective(90.0, 1.0, 1.0, 100.0);
  gl.uniformMatrix4fv(PLoc, false, flatten(P));

var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);

var texSize = 64;
var numRows = 8;
var numCols = 8;

var myTexels = new Uint8Array(4*texSize*texSize);

for(var i = 0; i < texSize; ++i)
  for(var j = 0; j < texSize; ++j){
      var patchx = Math.floor(i/(texSize/numRows));
      var patchy = Math.floor(j/(texSize/numCols));
      var c = (patchx%2 !== patchy%2 ? 255 : 0);
      var idx = 4*(i*texSize + j);
      myTexels[idx] = myTexels[idx + 1] = myTexels[idx + 2] = c;
      myTexels[idx + 3] = 255;
}

gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);

var texCoord = [
  vec2(-1.5, 0.0),
  vec2(2.5, 0.0),
  vec2(2.5, 10.0),
  vec2(-1.5, 10.0)
];

var tBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoord), gl.STATIC_DRAW);
var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vTexCoord);


var texturewarppingbutton = document.getElementById("texturewarpping");
var minificationmenu = document.getElementById("minification");
var magnficationmenu =document.getElementById("magnfication");
var minificationmenu2 =document.getElementById("minification2");


var texturewarpping=0;
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
texturewarppingbutton.addEventListener("click", function(ev) {
  console.log("better");
  render();
  if (texturewarpping==0){
    texturewarpping=1;
  }
  else{
    texturewarpping=0;
  };
})

//With magnification the texel is larger than one pixel.
var magnfication=0;
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
magnficationmenu.addEventListener("change", function(ev) {
  magnfication = magnficationmenu.selectedIndex;
})

//With minification the texel is smaller than one pixel.
var minification=0;
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
minificationmenu.addEventListener("change", function(ev) {
  minification = minificationmenu.selectedIndex;
  if (minification=="0"){
    //Nearest sampleing gives less smooth, more aliased image
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);}
  else if (minification=="1"){
    //Linear sampleing gives smoother, less aliased image
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);}
  //Mipmaping
  else if (minification=="2"){
    gl.generateMipmap(gl.TEXTURE_2D);
    //Point sampling using the best mipmap
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);}
  else if (minification=="3"){
    gl.generateMipmap(gl.TEXTURE_2D);
    //Point sampling using the best mipmap
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);}
  else if (minification=="4"){
    gl.generateMipmap(gl.TEXTURE_2D);
    //Point sampling using nearest filtering between mipmaps
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);}
  else {
    gl.generateMipmap(gl.TEXTURE_2D);
    //Point sampling using the best mipmap and nearest filtering between mipmaps
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);}

  render();
})


gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
function render(){
   gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
     if (texturewarpping==0){
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
       if (magnfication==0){
         //Nearest sampleing gives less smooth, more aliased image
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
       }
       else{
         //Linear sampleing gives smoother, less aliased image
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
       }
      }
     else {
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       if (magnfication==0){
         //Nearest sampleing gives less smooth, more aliased image
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
       }
       else{
         //Linear sampleing gives smoother, less aliased image
         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
       }
     }
   gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
   requestAnimFrame(render);
 }

  render();
}

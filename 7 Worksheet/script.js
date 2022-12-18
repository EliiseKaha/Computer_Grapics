window.onload= function init(){
    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  
    /*var cameraButton= document.getElementById("camera");
    var camera=1;
    cameraButton.addEventListener("click", function(ev){
      console.log("better");
      if (camera==1){
        camera=0;
      }
      else{
        camera=1;
      }
    })*/
  
    var numSubdivs= 6;
  
    program = initShaders(gl, "vertex-shader", "fragment-shader");
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

    bgArray = [
      vec4(-1.0, -1.0, 0.999, 1.0),
      vec4( 1.0, -1.0, 0.999, 1.0),
      vec4( 1.0,  1.0, 0.999, 1.0),

      vec4(-1.0, -1.0, 0.999, 1.0),
      vec4( 1.0,  1.0, 0.999, 1.0),
      vec4(-1.0,  1.0, 0.999, 1.0)];
  
  bgArray.forEach(item => { pointsArray.push(item);});
  
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
  
    /*var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);*/
  
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);
  
    var beta=0.0;
    var radius=3.0;
    var eye=vec3(radius*Math.cos(beta), 0.0, radius*Math.sin(beta));
  
    var VLoc=gl.getUniformLocation(program, "u_ModelMatrix");
    var PLoc = gl.getUniformLocation(program, "u_ProjectionMatrix");


    var P = perspective(45.0, 1.0, 0.001, 100);
    var V = lookAt(eye,vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));


    gl.uniformMatrix4fv(PLoc, false, flatten(P));
    gl.uniformMatrix4fv(VLoc, false, flatten(V));



    var g_tex_ready = 0;

    function initTexture(){   
        var cubemap = ['textures/cm_left.png', // POSITIVE_X
                            'textures/cm_right.png', // NEGATIVE_X
                            'textures/cm_top.png', // POSITIVE_Y
                            'textures/cm_bottom.png', // NEGATIVE_Y
                            'textures/cm_back.png', // POSITIVE_Z
                            'textures/cm_front.png']; // NEGATIVE_Z
       gl.activeTexture(gl.TEXTURE0);
       var texture = gl.createTexture();
       gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
       gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
       gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
       for(var i = 0; i < 6; ++i) {
         var image = document.createElement('img');
         image.crossorigin = 'anonymous';
         image.textarget = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
    
         image.onload = function(event) {
           var image = event.target;
           gl.activeTexture(gl.TEXTURE0);
           gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
           gl.texImage2D(image.textarget, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
           ++g_tex_ready;
         };
       image.src = cubemap[i];
       }
    
       gl.uniform1f(gl.getUniformLocation(program, "texMap"), 0);
    }
    initTexture();
    render();

   function render(){
      gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
      
      eye = vec3(radius*Math.sin(beta), 0.0, radius*Math.cos(beta));

      VLoc=gl.getUniformLocation(program, "u_ModelMatrix");
      PLoc = gl.getUniformLocation(program, "u_ProjectionMatrix");
      var TLoc = gl.getUniformLocation(program, "u_TexMatrix");

      P = perspective(45.0, 1.0, 0.1, 100.0);
      V = lookAt(eye,vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));
      var T= mult(inverse4(V), inverse4(P));//Texture matrix consisting of
                                            //the inverse of the projection matrix to go from clip coordinates to camera coordinates and 
                                            //the inverse of the rotational part of the view matrix (no translation) to get direction vectors in world coordinates
    
      gl.uniformMatrix4fv(PLoc, false, flatten(P));
      gl.uniformMatrix4fv(VLoc, false, flatten(mat4()));//identity matrix 
      gl.uniformMatrix4fv(TLoc, false, flatten(T));

      gl.drawArrays(gl.TRIANGLES, 0, bgArray.length);

      gl.uniformMatrix4fv(PLoc, false, flatten(P));
      gl.uniformMatrix4fv(VLoc, false, flatten(mult(P, V)));
      gl.uniformMatrix4fv(TLoc, false, flatten(mat4()));//identity matrix
      
      gl.drawArrays(gl.TRIANGLES, bgArray.length, pointsArray.length - bgArray.length);
      
      requestAnimFrame(render);
    }
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
var gl;

function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}


function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }
  
  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }
  
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
  
  gl.shaderSource(shader, str);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
}

//var shaderProgram;
var lshaderProgram;

function initShaders() {
/*
  { // circle shader
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    
    //gl.useProgram(shaderProgram);
    
    shaderProgram.vertexPositionAttribute =
      gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    
    shaderProgram.vertexColorAttribute =
      gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    
    shaderProgram.pMatrixUniform =
      gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform =
      gl.getUniformLocation(shaderProgram, "uMVMatrix");
  }
*/
  { // line shader
    var fragmentShader = getShader(gl, "lshader-fs");
    var vertexShader = getShader(gl, "lshader-vs");
    
    lshaderProgram = gl.createProgram();
    gl.attachShader(lshaderProgram, vertexShader);
    gl.attachShader(lshaderProgram, fragmentShader);
    gl.linkProgram(lshaderProgram);
    
    if (!gl.getProgramParameter(lshaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    
    //gl.useProgram(shaderProgram);
    
    lshaderProgram.vertexPositionAttribute =
      gl.getAttribLocation(lshaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(lshaderProgram.vertexPositionAttribute);
    
    lshaderProgram.vertexColorAttribute =
      gl.getAttribLocation(lshaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(lshaderProgram.vertexColorAttribute);
    
    lshaderProgram.pMatrixUniform =
      gl.getUniformLocation(lshaderProgram, "uPMatrix");
    lshaderProgram.mvMatrixUniform =
      gl.getUniformLocation(lshaderProgram, "uMVMatrix");
  }
}

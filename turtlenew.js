//------------------------------------------------------------
// Parse lines
// Lines must be in reverse order.
//------------------------------------------------------------
function parseLines(lines) {
  var commands = [];
  while (lines.length > 0) {
    var line = lines.pop();
    line = line.trim();
    var tokens = line.split(' ');
    if (tokens.length == 0) {
      // Empty line
      continue;
    }
    var command = new String(tokens[0]);
    var newCommands = [];
    if (command == 'forward' || command == 'right' || command == 'left') {
      command.cmdValue = parseFloat(tokens[1]);
    } else if (command == 'color') {
      command.r = parseFloat(tokens[1]);
      command.g = parseFloat(tokens[2]);
      command.b = parseFloat(tokens[3]);
    } else if (command == 'loop') {
      if (tokens[2] != '{')
        throw new Error('Expected opening brace after loop command');
      var loopIters = parseInt(tokens[1]);
      var loopCommands = parseLines(lines);
      for (i = 0; i < loopIters; ++i) {
        newCommands = newCommands.concat(loopCommands);
      }
    } else if (command == '}') {
      return commands;
    }

    if (newCommands.length > 0) {
      commands = commands.concat(newCommands);
    } else {
      commands = commands.concat([command]);
    }
  }
  return commands;
}

//------------------------------------------------------------
// Split text into lines and parse
//------------------------------------------------------------
function parseText(text) {
  var lines = text.replace(/\r\n/g, '\n').split('\n');
  lines.reverse();
  return parseLines(lines);
}

var lineVertexPositionBuffer;
var lineVertexColorBuffer;

//------------------------------------------------------------
// Initialize the position and color buffers to render crosshairs.
//------------------------------------------------------------
function crosshairs() {
  // Draw crosshairs in the center
  var numLines = 2;
  var lvertices = [-25.0, 0.0, 0.0,
                   25.0, 0.0, 0.0,
                   0.0, -25.0, 0.0,
                   0.0, 25.0, 0.0];
  var lcolors = [0.0, 0.0, 0.0, 1.0,
                 0.0, 0.0, 0.0, 1.0,
                 0.0, 0.0, 0.0, 1.0,
                 0.0, 0.0, 0.0, 1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lvertices),
                gl.STATIC_DRAW);
  lineVertexPositionBuffer.itemSize = 3;
  lineVertexPositionBuffer.numLines = numLines;

  lineVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lcolors),
                gl.STATIC_DRAW);
  lineVertexColorBuffer.itemSize = 4;
}

//------------------------------------------------------------
// Execute turtle code
//------------------------------------------------------------
var logCommands = false;
function execute() {
  // TODO: a useful debugging tool is console logging. To see these "print"
  // statements in Google Chrome version 34.0 go to
  //    View > Developer > JavaScript Console
  console.log("Rendering turtle commands");

  // Parse commands
  var textArea = document.getElementById('CODE_ID');
  var commands = parseText(textArea.value);

  // TODO: remove this call and initialize buffers as described below.
  crosshairs();

  // Loop through the commands
  for (i = 0; i < commands.length; ++i) {
    command = commands[i];

    if (logCommands) {
      if (command.hasOwnProperty('cmdValue')) {
        console.log(command.valueOf() + ' ' + command.cmdValue);
      } else {
        console.log(command.valueOf());
      }
    }

    // TODO: look at each command and store vertices and colors. You should
    // get familiar with the parseLines() function.
  }

  // TODO: initialize the position and color buffers. You should get familiar
  // with the crosshairs() function.
  
  // redraw
  drawScene();
}

//------------------------------------------------------------
// File loading and parsing
//------------------------------------------------------------
function loadFile(filePath) {
  // Parse text
  readText(filePath);

  var button = document.getElementById('LOAD_BUTTON_ID');
  button.value = '';
}

//------------------------------------------------------------
// Matrix operations
//------------------------------------------------------------
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw 'Invalid popMatrix!';
  }
  mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(lshaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(lshaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

//------------------------------------------------------------
// Default load
//------------------------------------------------------------
function initBuffers() {
  lineVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);

  // Draw crosshairs in the center
  var numLines = 2;
  var lvertices = [-25.0, 0.0, 0.0,
                   25.0, 0.0, 0.0,
                   0.0, -25.0, 0.0,
                   0.0, 25.0, 0.0];
  var lcolors = [1.0, 1.0, 1.0, 1.0,
                 1.0, 1.0, 1.0, 1.0,
                 1.0, 1.0, 1.0, 1.0,
                 1.0, 1.0, 1.0, 1.0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lvertices),
                gl.STATIC_DRAW);
  lineVertexPositionBuffer.itemSize = 3;
  lineVertexPositionBuffer.numLines = numLines;

  lineVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lcolors),
                gl.STATIC_DRAW);
  lineVertexColorBuffer.itemSize = 4;
}

function drawScene() {
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.ortho(-100, 100, -100, 100, 1, -1, pMatrix);
  mat4.identity(mvMatrix);

  // draw lines
  gl.useProgram(lshaderProgram);
  mvPushMatrix();

  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
  gl.vertexAttribPointer(lshaderProgram.vertexPositionAttribute,
                         lineVertexPositionBuffer.itemSize,
                         gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
  gl.vertexAttribPointer(lshaderProgram.vertexColorAttribute,
                         lineVertexColorBuffer.itemSize,
                         gl.FLOAT, false, 0, 0);

  setMatrixUniforms();
  gl.lineWidth(0.5);
  gl.drawArrays(gl.LINES, 0, lineVertexPositionBuffer.numLines * 2);
  mvPopMatrix();
}

function handleKeyDown(event) {
  if (String.fromCharCode(event.keyCode) == 'L' &&
      event.getModifierState('Control')) {
    execute();
  }
}

function webGLStart() {
  checkFileAPI();

  var canvas = document.getElementById('turtle-canvas');
  initGL(canvas);
  initShaders();
  initBuffers();

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  document.onkeydown = handleKeyDown;

  execute();
}

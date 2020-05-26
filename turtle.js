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
  var lvertices = [-25.0, 0.0, 0.0, // x, y, z
                   25.0, 0.0, 0.0,
                   0.0, -25.0, 0.0,
                   0.0, 25.0, 0.0];
  var lcolors = [1.0, 0.0, 1.0, 1.0, // rgba
                 1.0, 0.0, 1.0, 1.0,
                 1.0, 0.0, 1.0, 1.0,
                 1.0, 0.0, 1.0, 1.0];

    //Initialize buffers
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
var logCommands = true;
function execute() {
  // TODO: a useful debugging tool is console logging. To see these "print"
  // statements in Google Chrome version 34.0 go to
  //    View > Developer > JavaScript Console
  console.log('Rendering turtle commands');

  // Parse commands
  var textArea = document.getElementById('CODE_ID');
  var commands = parseText(textArea.value);

  // TODO: remove this call and initialize buffers as described below.
    //crosshairs();

    //initialize buffers
    //initBuffers();

    //vertices
    lvertices = [];
    lcolors = [];
    lineNumb = 0;
    var isDown = true;
      // origin, theta = 0 means pointing North
    var currentPos = { x: 0, y: 0, theta: 0 };
    var currentColor = { r: 1.0, g: 1.0, b: 1.0, a: 1.0};
    var firstVert = true;
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
    if (command == 'forward') {
        //alert('forward');
        var angle, newX, newY;
        //if (firstVert && isDown) {
        //    alert(currentPos.x + " " + currentPos.y + " " + currentPos.theta)
        //    lvertices = lvertices.concat(addVert(currentPos));
        //    lcolors = lcolors.concat(addColor(currentColor));
        //    firstVert = false;
        //}
        if (isDown) { //one to one correlation to vertices and colors?
            //alert('add');
            //lineNumb++;
            lvertices = lvertices.concat(addVert(currentPos));
            lcolors = lcolors.concat(addColor(currentColor));
        }
        angle = currentPos.theta;
        //using law of sin
        newX = command.cmdValue * Math.sin((angle / 180) * Math.PI);
        newY = command.cmdValue * Math.sin(((90 - angle) / 180) * Math.PI);
        //alert(newX + ' ' + newY);
        currentPos.x = currentPos.x + newX;
        currentPos.y = currentPos.y + newY;
        if (isDown) { //one to one correlation to vertices and colors?
            //alert('add');
            //lineNumb++;
            lvertices = lvertices.concat(addVert(currentPos));
            lcolors = lcolors.concat(addColor(currentColor));
        }
    }
    else if (command == 'origin') {
        currentPos.x = 0;
        currentPos.y = 0;
        currentPos.theta = 0;
    }
    else if (command == 'right') {
        currentPos.theta = currentPos.theta + command.cmdValue;
        if (currentPos.theta >= 360)
            while (currentPos.theta >= 360) // for overflow reasons
                currentPos.theta = currentPos.theta - 360;
    }
    else if (command == 'left') {
        currentPos.theta = currentPos.theta - command.cmdValue;
        if (currentPos.theta < 0)
            while (currentPos.theta < 0) // for overflow reasons
                currentPos.theta = currentPos.theta + 360;
    }
    else if (command == 'color') {
        currentColor.r = command.r;
        currentColor.g = command.g;
        currentColor.b = command.b;

    }
    else if (command == 'down') {
        //lvertices = lvertices.concat(addVert(currentPos));
        isDown = true;
    }
    else if (command == 'up') {
        isDown = false;
    }

    console.log(currentPos.x + ' ' + currentPos.y + ' ' + currentPos.theta);

  }
//alert(lvertices.length);
  //alert("int start");
  //for (var i = 0; i < lvertices.length; i++) {

      //alert(lvertices.length);
  //}

  // TODO: initialize the position and color buffers. You should get familiar
    // with the crosshairs() function.
    //Initialize buffers

  //alert(lvertices);

  lineVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lvertices),
                gl.STATIC_DRAW);
  lineVertexPositionBuffer.itemSize = 3;
  lineVertexPositionBuffer.numLines = (lvertices.length / 6);


  //alert(lcolors);

  lineVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lcolors),
                gl.STATIC_DRAW);
  lineVertexColorBuffer.itemSize = 4;

  //alert('init done');

  // redraw
  drawScene();
}

//------------------------------------------------------------
// helper functions
//------------------------------------------------------------
function addVert(pos) {
    var arr = [];
    //alert('add vert ' + pos.x + ' ' + pos.y);
    arr.push(Math.round(pos.x * 100) / 100);
    arr.push(Math.round(pos.y * 100) / 100);
    arr.push(0);
    //alert(arr.length);
    return arr;
}
function addColor(color) {
    var arr = [];
    arr.push(color.r);
    arr.push(color.g);
    arr.push(color.b);
    arr.push(1.0);
    return arr;
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

  //// Draw crosshairs in the center
  var numLines = 2;
  //var lvertices = [-25.0, 0.0, 0.0,
  //                 25.0, 0.0, 0.0,
  //                 0.0, -25.0, 0.0,
  //                 0.0, 25.0, 0.0];
  //var lcolors = [1.0, 0.0, 1.0, 1.0,
  //               1.0, 0.0, 1.0, 1.0,
  //               1.0, 0.0, 1.0, 1.0,
    //               1.0, 0.0, 1.0, 1.0];
  var lvertices = [];
  var lcolors = [];


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
    //alert("draw scene");
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.ortho(-100, 100, -100, 100, 1, -1, pMatrix);
  mat4.identity(mvMatrix);

  // draw lines
  gl.useProgram(lshaderProgram);
  mvPushMatrix();

  //alert("before bind buff");

  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexPositionBuffer);
  gl.vertexAttribPointer(lshaderProgram.vertexPositionAttribute,
                         lineVertexPositionBuffer.itemSize,
                         gl.FLOAT, false, 0, 0);

  //alert("after vertex bind");

  gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
  gl.vertexAttribPointer(lshaderProgram.vertexColorAttribute,
                         lineVertexColorBuffer.itemSize,
                         gl.FLOAT, false, 0, 0);

  //alert('after color bind');

  setMatrixUniforms();
  gl.lineWidth(0.5);
  //alert("line width after");
  gl.drawArrays(gl.LINES, 0, lineVertexPositionBuffer.numLines * 2);
  //alert("before pop");
  mvPopMatrix();
  //alert("end draw scene");
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

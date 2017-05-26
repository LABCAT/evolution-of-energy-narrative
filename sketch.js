var canvasWidth = 960;
var canvasHeight = 500;

var is_playing = false;
var show_oddball = false;
var modeSelector;
var sizeSelector;

var max_vals = [360, 100, 100];
var allAgents = [];
var numActiveAgents = 0;

var clearButton, randomButton, playButton, stepButton, stopButton;

function setup() {
  // create the drawing canvas, save the canvas element
  var main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  modeSelector = createSelect();
  modeSelector.option('grid');
  // modeSelector.option('hexgrid');
  // modeSelector.option('vornoi');
  // modeSelector.option('freestyle');
  modeSelector.changed(modeChangedEvent);
  modeSelector.value('grid');
  modeSelector.parent('selector1Container');

  sizeSelector = createSelect();
  sizeSelector.option('32');
  sizeSelector.option('64');
  sizeSelector.option('128');
  sizeSelector.option('256');
  sizeSelector.parent('selector3Container');
  sizeSelector.value('32');
  sizeSelector.changed(sizeChangedEvent);

  stepButton = createButton('step');
  stepButton.mousePressed(stepButtonPressedEvent);
  stepButton.parent('playButtonContainer');

  playButton = createButton('play');
  playButton.mousePressed(playButtonPressedEvent);
  playButton.parent('playButtonContainer');

  // stopButton = createButton('stop');
  // stopButton.mousePressed(stopButtonPressedEvent);
  // stopButton.parent('playButtonContainer');

  clearButton = createButton('clear');
  clearButton.mousePressed(clearButtonPressedEvent);
  clearButton.parent('clearButtonContainer');

  randomButton = createButton('random');
  randomButton.mousePressed(randomButtonPressedEvent);
  randomButton.parent('clearButtonContainer');

  // guideCheckbox = createCheckbox('', false);
  // guideCheckbox.parent('checkContainer');
  // guideCheckbox.changed(guideChangedEvent);

  noLoop();
  refreshGridData();
  modeChangedEvent();
}

/*
function mouseClicked() {
  if (mouseX > width/4) {
    refreshGridData();
  }
  redraw();
}
*/

var numGridRows;
var numGridCols;
var gridValues; // row, col order
var gridOffsetX, gridOffsetY;
var gridSpacingX, gridSpacingY;
// Generate data for putting glyphs in a grid

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function getNewAgent() {
  a = new Agent1();
  a.setup(0);
  return a;
}

function refreshGridData() {
  var mode = modeSelector.value();
  var glyphSize = parseInt(sizeSelector.value(), 10);

  if (mode == "hexgrid") {
    if(glyphSize == 32) {
      numGridCols = 30;
      numGridRows = 17;
      gridOffsetX = 10;
      gridSpacingX = 31;
      gridOffsetY = 2;
      gridSpacingY = 29;
    }
    else if(glyphSize == 64) {
      numGridCols = 13;
      numGridRows = 9;
      gridOffsetX = 35;
      gridSpacingX = 66;
      gridOffsetY = -18;
      gridSpacingY = 59;
    }
    else if(glyphSize == 128) {
      numGridCols = 7;
      numGridRows = 5;
      gridOffsetX = 10;
      gridSpacingX = 132;
      gridOffsetY = -50;
      gridSpacingY = 118;
    }
    else if(glyphSize == 256) {
      numGridCols = 3;
      numGridRows = 3;
      gridOffsetX = 96;
      gridSpacingX = 262;
      gridOffsetY = -100;
      gridSpacingY = 234;
    }
  }
  else if(glyphSize == 128) {
    numGridCols = 7;
    numGridRows = 3;
    gridOffsetX = 10;
    gridSpacingX = 136;
    gridOffsetY = 20;
    gridSpacingY = 166;
  }
  else if(glyphSize == 256) {
    numGridCols = 3;
    numGridRows = 1;
    gridOffsetX = 20;
    gridSpacingX = 320;
    gridOffsetY = 100;
    gridSpacingY = 500;
  }
  else if(glyphSize == 64) {
    numGridCols = 14;
    numGridRows = 7;
    gridOffsetX = 3;
    gridSpacingX = 68;
    gridOffsetY = 6;
    gridSpacingY = 71;
  }
  else if(glyphSize == 32) {
    numGridCols = 24;
    numGridRows = 13;
    gridOffsetX = 4;
    gridSpacingX = 40;
    gridOffsetY = 4;
    gridSpacingY = 38;
  }
  numActiveAgents = 0;
  gridValues = new Array(numGridRows);
  for (var i=0; i<numGridRows; i++) {
    gridValues[i] = new Array(numGridCols);
    for (var j=0; j<numGridCols; j++) {
      if(numActiveAgents >= allAgents.length) {
        allAgents.push(getNewAgent());
      }
      gridValues[i][j] = allAgents[numActiveAgents];
      numActiveAgents = numActiveAgents + 1;
    }
  }

  // assign positions
  var hexOffset = (mode == "hexgrid");
  for (var i=0; i<numGridRows; i++) {
    var tweakedNumGridCols = numGridCols;
    var offsetX = 0;
    if (hexOffset && i%2 == 1) {
      offsetX = gridSpacingX / 2;
      tweakedNumGridCols = numGridCols - 1;
    }
    for (var j=0; j<tweakedNumGridCols; j++) {
      gridValues[i][j]._x = gridOffsetX + j * gridSpacingX + offsetX
      gridValues[i][j]._y = gridOffsetY + i * gridSpacingY
    }
  }

  // compute neighbors
  for (var i=0; i<allAgents.length; i++) {
    allAgents[i]._neighbors = []
  }

  for (var i=0; i<numActiveAgents; i++) {
    var agent = allAgents[i];
    for (var j=i+1; j<numActiveAgents; j++) {
      var other = allAgents[j]
      var d = dist(agent._x, agent._y, other._x, other._y) / glyphSize
      if (d < 2.0) {
        var o1 = {
          'distance': d,
          'agent': other,
          'x': other._x - agent._x,
          'y': other._y - agent._y
        }
        agent._neighbors.push(o1)
        var o2 = {
          'distance': d,
          'agent': agent,
          'x': agent._x - other._x,
          'y': agent._y - other._y
        }
        other._neighbors.push(o2)
      }
    }
  }
}

function sizeChangedEvent() {
  var mode = modeSelector.value();
  refreshGridData();
  redraw();
}

function guideChangedEvent() {
  show_oddball = guideCheckbox.checked();
  redraw();
}

function modeChangedEvent() {
  var mode = modeSelector.value();

  if (is_playing) {
    playButton.elt.textContent = "pause";
    stepButton.attribute('disabled','');
    // stopButton.removeAttribute('disabled');
  }
  else {
    playButton.elt.textContent = "play";
    stepButton.removeAttribute('disabled');
    // stopButton.attribute('disabled','');
  }

  if (mode === "drive") {
    // disable the button
    // button.attribute('disabled','');

    // enable the size selector
    sizeSelector.removeAttribute('disabled');
  }
  else {
    // enable the button
    // button.removeAttribute('disabled');

    // enable the size selector
    // sizeSelector.removeAttribute('disabled');

    // refresh data
    refreshGridData();
  }
  if (mode === "hexgrid") {
    // refresh data
    refreshGridData();
  }

  redraw();
}

function clearButtonPressedEvent() {
  for(var i=0; i<allAgents.length; i++) {
    allAgents[i].setup(0);
  }
  redraw();
}

function randomButtonPressedEvent() {
  for(var i=0; i<allAgents.length; i++) {
    allAgents[i].setup(random(100));
  }
  redraw();
}

function playButtonPressedEvent() {
  if(is_playing) {
    is_playing = false
    noLoop();
  }
  else {
    is_playing = true;
    loop();
  }
  modeChangedEvent()
  refreshGridData();
  redraw();
}

function stepButtonPressedEvent() {
  is_playing = true;
  refreshGridData();
  redraw();
  is_playing = false;
}

function stopButtonPressedEvent() {
  refreshGridData();
  redraw();
}

var colorBack = "rgb(232, 232, 232)"
var colorFront = "rgb(192, 192, 255)"

function highlightGlyph(glyphSize) {
  halfSize = glyphSize / 2.0;
  stroke(0, 0, 255, 128);
  noFill();
  strokeWeight(4);
  ellipse(halfSize, halfSize, glyphSize+4);
  fill(0);
  strokeWeight(1);
}

function drawGrid() {
  var glyphSize = parseInt(sizeSelector.value(), 10);
  background(colorBack);
  for (var i=0; i<numActiveAgents; i++) {
    resetMatrix();
    agent = allAgents[i];
    translate(agent._x, agent._y);
    agent.draw(glyphSize);
    resetMatrix();
    if (show_oddball) {
      translate(agent._x, agent._y);
      highlightGlyph(glyphSize)
    }
  }
}

function stepGrid() {
  var glyphSize = parseInt(sizeSelector.value(), 10);
  for (var i=0; i<numActiveAgents; i++) {
    agent = allAgents[i];
    agent.step(agent._neighbors);
  }
  for (var i=0; i<numActiveAgents; i++) {
    agent = allAgents[i];
    agent.update_state();
  }
}

function activateGrid(x, y) {
  var glyphSize = parseInt(sizeSelector.value(), 10);
  for (var i=0; i<numActiveAgents; i++) {
    agent = allAgents[i];
    if( (agent._x <= x) && (agent._x + glyphSize > x) &&
        (agent._y <= y) && (agent._y + glyphSize > y) ) {
      agent.activate();
    }
  }
}

function mouseClicked () {
  activateGrid(mouseX, mouseY);
  drawGrid();
}

function draw () {
  var mode = modeSelector.value();

  // first do all steps
  if (is_playing) {
    stepGrid();
  }
  // then do activate
  activateGrid(mouseX, mouseY);
  // the do all draws
  drawGrid();
  resetMatrix();
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
  else if (key == ' ') {
    refreshGridData();
    redraw();
  }
  else if (key == 's') {
    var old_value = guideCheckbox.checked();
    guideCheckbox.checked(!old_value);
    guideChangedEvent();
  }
  else if (key == '1') {
    sizeSelector.value('32');
    sizeChangedEvent()
  }
  else if (key == '2') {
    sizeSelector.value('64');
    sizeChangedEvent()
  }
  else if (key == '3') {
    sizeSelector.value('128');
    sizeChangedEvent()
  }
  else if (key == '4') {
    sizeSelector.value('256');
    sizeChangedEvent()
  }
  else if (key == 'd') {
    modeSelector.value('drive');
    modeChangedEvent()
  }
  else if (key == 'g') {
    modeSelector.value('grid');
    modeChangedEvent()
  }
  else if (key == 'r') {
    modeSelector.value('random');
    modeChangedEvent()
  }
  else if (key == 'h') {
    modeSelector.value('hexgrid');
    modeChangedEvent()
  }
}

function keyPressed() {
}

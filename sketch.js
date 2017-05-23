var canvasWidth = 960;
var canvasHeight = 500;

var homeButton, awayButton, checkbox;
var innings = [0,1,3,6,3,4,6,0,1,2,4,2,3,4,0,0,1,1,3,2,1,6,4,6,4,2,4,1,3,2,0 ];

var colors = {
    0: [255, 255, 255],
    1: [0, 255, 255],
    2: [0, 255, 0],
    3: [0, 0, 255],
    4: [255, 255, 0],
    5: [0, 0, 0],
    6: [255, 0, 0],
}

var meters = {
    0: 25,
    1: 60,
    2: 100,
    3: 130,
    4: 150,
    5: 140,
    6: 160,
}

function setup () {
  // create the drawing canvas, save the canvas element
  var main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  // this means draw will only be called once
  noLoop();
}

// draw five colors and then five glyphs
function draw () {
  background(255, 255, 220);
  stroke(0);
  strokeWeight(4);

  line(320, 0, 320, canvasHeight);
  line(640, 0, 640, canvasHeight);
  
  drawCricketField(160);
  drawButtons(40);
  drawBattingPositions(40);
  drawCricketField(480);
  drawButtons(360);
  drawBattingPositions(360); 
  drawInningsVisualisation(480);
  drawCricketField(800);
  drawButtons(680);
  drawBattingPositions(680);
  drawInningsVisualisation(800);

}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}

function drawButtons(xPos){
  homeButton = createButton('HOME')
  homeButton.addClass('home-'+xPos);
  homeButton.position(xPos, 370); 
  awayButton = createButton('AWAY');
  awayButton.addClass('away-'+xPos);
  awayButton.position(xPos + 60, 370);
}

function drawBattingPositions(xPos){
  for (var i = 0; i < 6; i++) {
    checkbox = createCheckbox(i + 1, false);
    checkbox.position(xPos + (i * 30), 440); 
  }
  for (var i = 0; i < 5; i++) {
    checkbox = createCheckbox(i + 7, false);
    checkbox.position(xPos + (i * 30), 470); 
  }
}

function drawCricketField(xPos){
  stroke(55);
  strokeWeight(1);
  fill(234, 233, 141);
  ellipse(xPos, 160, 300);

  strokeWeight(0);
  fill(155, 180, 23);
  ellipse(xPos, 160, 280);

  rectMode(CENTER);
  stroke(255);
  strokeWeight(1);
  fill(101, 166, 16, 127);
  rect(xPos, 160, 120, 160, 100);

  fill(0);
  textStyle(BOLD);
  text("Team", xPos - 140, 340);
  text("Batting Position", xPos - 140, 410);
}

function drawInningsVisualisation(xPos) {
  rectMode(CORNER);
  var inningsLength = innings.length;
  for (var i = 0; i < inningsLength; i++) {
      fill(colors[innings[i]][0], colors[innings[i]][1], colors[innings[i]][2]);
      push();
      translate(xPos, 160);
      var degree = random(359);
      rotate(degree);
      strokeWeight(0);
      rect(0, 0, meters[innings[i]], 1);
      pop();  
  }
  
  
}
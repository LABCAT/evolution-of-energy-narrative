var canvasWidth = 960;
var canvasHeight = 500;

var homeButton, awayButton, checkbox, teamSelect;

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
  
  drawFirstPanel();
  
  drawSecondPanel();
  
  drawThirdPanel();
}

function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}

function drawFirstPanel(){
	drawCricketField(160, 10);

	fill(0);
	strokeWeight(0);
	textStyle(BOLD);
	textSize(20);
	text("T20I Match Simulator", 60, 60);
	
	textStyle(NORMAL);
	textSize(16);
	
	text("Match Number", 40, 270);
	teamSelect = createInput();
	teamSelect.addClass('match-number');
	teamSelect.position(180, 261);
	
	homeButton = createButton('VIEW');
	homeButton.addClass('button');
	homeButton.position(180, 300); 
	
	text("Team A", 40, 350);
	teamSelect = createSelect();
	teamSelect.option('Select Team A');
	teamSelect.option('Australia');
	teamSelect.option('New Zealand');
	teamSelect.position(180, 341);
	
	text("Team B", 40, 390);
	teamSelect = createSelect();
	teamSelect.option('Select Team B');
	teamSelect.option('Australia');
	teamSelect.option('New Zealand');
	teamSelect.position(180, 381);
	
	text("Home Team", 40, 430);
	teamSelect = createSelect();
	teamSelect.option('Neutral Venue');
	teamSelect.option('Team A');
	teamSelect.option('Team B');
	teamSelect.position(180, 421);
	
	homeButton = createButton('SIMULATE');
	homeButton.addClass('button');
	homeButton.position(180, 460); 
}

function drawSecondPanel(){
	drawCricketField(480);
	drawInningsVisualisation(480);
	
	fill(0);
	strokeWeight(0);
	
	textStyle(BOLD);
	textSize(20);
	text("1st Innings", 335, 360);
	
	textStyle(NORMAL);
	textSize(16);
	
	text("NZ won the toss and choose to bat", 335, 390);
	
	textStyle(BOLD);
	
	textSize(20);
	text("New Zealand 209/6 (20.0 ov)", 335, 430);
	
	text("RR 10.45", 335, 470);
}

function drawThirdPanel(){
	drawCricketField(800);
	drawInningsVisualisation(800, 37);
	
	fill(0);
	strokeWeight(0);
	textStyle(BOLD);
	textSize(20);
	text("2nd Innings", 655, 360);
	
	textStyle(NORMAL);
	textSize(16);
	
	text("Australia require 136 runs to win", 655, 390);
	
	textStyle(BOLD);
	
	textSize(20);
	text("Australia 74/2 (6.1 ov)", 655, 430);
	
	text("RR 12.00, Required RR 9.83", 655, 470);
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

function drawCricketField(xPos, size = 20){
  stroke(55);
  strokeWeight(1);
  fill(234, 233, 141);
  ellipse(xPos, 160, size * 15);

  strokeWeight(0);
  fill(155, 180, 23);
  ellipse(xPos, 160, size * 14);

  rectMode(CENTER);
  stroke(255);
  strokeWeight(1);
  fill(101, 166, 16, 127);
  rect(xPos, 160, size * 6, size * 8, 100);
}

function drawInningsVisualisation(xPos, balls = 120) {
  rectMode(CORNER);
  for (var i = 0; i < balls; i++) {
	var runs = floor(random(7));
	fill(colors[runs][0], colors[runs][1], colors[runs][2]);
	push();
	translate(xPos, 160);
	var degree = random(359);
	rotate(degree);
	strokeWeight(0);
	rect(0, 0, meters[runs], 1);
	pop();  
  }
  
  
}
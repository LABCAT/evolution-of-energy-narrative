function Agent2() {
  // any variables you add here are for your own internal state
  this.power = 0.0;
  this.next_power = 0.0;
  this.rain_received = 0.0;
  this.next_rain_received = 0.0;

  // setup is run when the agent is reset
  // value is a number between 0 and 100
  this.setup = function(value, agent_type) {
    this.power = value;
    this.agent_type = agent_type;
    this.next_power = this.power;
  }

  // this happens generally on mouse over
  this.activate = function() {
    this.power = 100.0;
  }

  // decide on your next move based on neighbors (but don't do it yet)
  this.step = function(neighbors) {
    var max_power = 0;
    for(var i=0; i<neighbors.length; i++) {
      if(neighbors[i].y !=0) {
        if(neighbors[i].agent.power > max_power) {
          max_power = neighbors[i].agent.power;
        }
      }
    }
    if(this.agent_type == 0) {
      this.next_power = 0.8 * max_power;
    }
    else {
     this.next_power = 0.6 * max_power; 
    }
    if(this.next_power > 100) {
      this.next_power = 100;
    }
    this.next_rain_received = this.next_power/10;
  }

  // execute the next move you decided on
  this.update_state = function() {
    this.power = this.next_power;
    this.rain_received += this.next_rain_received;
  }

  this.draw = function(size) {
    var half_size = size/2;
    var low, high;
    if(this.agent_type == 0) {
      high = color(100, 100, 100) ;
      low = color(86, 170, 225);
    }
    else {
      high = color(255, 255, 255);
      low = color(220, 122, 4);
    }
    var c = lerpColor(low, high, this.power / 100.0);
    stroke(0);
    fill(c);
    ellipse(half_size, half_size, size, size);
    if(this.rain_received < 200){
      drawSeedlingState(size, this.power);  
    }
    else {
      drawTree(size);      
    }
  }
}

/**
 * draws the seedling state
 * @param {Number} size           - determines how big the seedling will be
 */
function drawSeedlingState(size, power){
  //first create an array of raindrops
  var rainfall = floor(power/4);
  var raindrops = [];
  if(rainfall > 1){
    for (var i = 0; i <= rainfall; i++) {
      raindrops.push(new rainDrop(size));
    }
    //the animate the rain drops to simulate rain
    for (var i = rainfall; i >= 0; i--) {
      raindrops[i].draw();
    }
  }
  //finally, draw the seedling at the bottom of the square
  fill(128,0,0);
  rectMode(CENTER);
  rect(0 + size/2, size -size/16, size/32, size/8);
  rectMode(CORNER);
  fill(5, 205, 30);
  translate(0 + size/2, size -size/6);
  rotate(PI/4);
  ellipse(size/32, 0-size/24, size/16, size/8);
  rotate(PI+PI/2);
  ellipse(size/32-size/16, 0-size/24, size/16, size/8);
}

/**
 * raindrop object consisting of 3 internal parameters and 2 functions
 * @param {Number} size           - determines how big the raindrop will be
 */
function rainDrop(size) {
  //set the size of the rain drop
  this.size = size;
  //set the x position of the rain drop
  this.x = random((size/32 * 6), (size - (size/32 * 6)));
  //set the y position of the rain drop
  this.y = random((size/32 * 6), (size - (size/32 * 6)));


  //the draw function draws the rain drop
  this.draw = function() {
    strokeWeight(0);
    fill(86, 170, 255, 255);
    ellipse(this.x, this.y, size/32, size/32);
  };
}

/**
 * draws a tree 
 * @param {Number} size           - determines how big the tree will be
 */
function drawTree(size){
  fill(128,0,0);
  rectMode(CENTER);
  rect(0 + size/2, size-size/8, size/32, size/4);
  rectMode(CORNER);
  fill(5, 205, 30);
  triangle(0+size*0.15, size-size*0.2, size/2, size/4, size-size*0.15, size-size*0.2);
  triangle(0+size/4, size-size*0.5, size/2, 0+size*0.1, size-size/4, size-size*0.5);
}
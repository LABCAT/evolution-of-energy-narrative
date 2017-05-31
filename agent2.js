function Agent2() {
	//the life stage of the agent
	this.life_stage = 'seedling';
	//maturity of the seedling and fruit - ranges from 0-205
	this.maturity = 0;
	//ripeness of the fruit - ranges from 7-255
	this.ripeness = 7;
	this.rainfall = 0.0;
	this.next_rainfall = 0.0;
	this.rain_received = 0.0;
	this.next_rain_received = 0.0;

	// setup is run when the agent is reset
	// value is a number between 0 and 100
	this.setup = function(value, agent_type) {
		this.rainfall = value;
		this.agent_type = agent_type;
		this.next_rainfall = this.rainfall;
	}

	// this happens generally on mouse over
	this.activate = function() {
		this.rainfall = 100.0;
	}

	// decide on your next move based on neighbors (but don't do it yet)
	this.step = function(neighbors) {
		var todays_rainfall = 0;
		var num_trees_nearby = 0;
		for(var i=0; i<neighbors.length; i++) {
			if(neighbors[i].agent.rainfall > todays_rainfall) {
			  todays_rainfall = neighbors[i].agent.rainfall;
			}
			if(neighbors[i].agent.life_stage === 'tree'){
				if(this.agent_type == 0) {
					num_trees_nearby++;
				}
				else if(this.agent_type && neighbors[i].y == 0){
					num_trees_nearby++;
				}
			}
		}
		if(this.agent_type == 0) {
			this.next_rainfall = 0.8 * todays_rainfall;
		}
		else {
			this.next_rainfall = 0.6 * todays_rainfall; 
		}
		if(this.next_rainfall > 100) {
		  this.next_rainfall = 100;
		}
		if(this.life_stage === 'seedling'){
			this.next_life_stage = 'seedling';
			if(this.rain_received > 200){
				this.next_life_stage = 'tree';
				this.next_rain_received = 0;
			}
			else {		
				this.next_rain_received = this.next_rainfall/10;
			}
		}
		//if current life stage is a tree
		else if(this.life_stage === 'tree'){
			this.next_life_stage = 'tree';
			//if the agent_type is 1 and the number of trees nearby is greater than 1 or the number of trees nearby is greater than 3
			if((num_trees_nearby > 1 && this.agent_type) || num_trees_nearby > 3){
				//then the next life stage is fruit
				this.next_life_stage = 'fruit';
			}
		}
		
	}

	// execute the next move you decided on
	this.update_state = function() {
		this.rainfall = this.next_rainfall;
		this.rain_received += this.next_rain_received;
		this.life_stage = this.next_life_stage;
	}

	this.draw = function(size) {
		var half_size = size/2;
		var low, high = color(100, 100, 100);
		if(this.agent_type == 0) {
		  low = color(86, 170, 225);
		}
		else {
		  low = color(220, 122, 4);
		}
		var c = lerpColor(low, high, this.rainfall / 100.0);
		stroke(0);
		if(this.life_stage === 'seedling'){
			fill(c);
		}
		else {
			fill(low);
		}
		ellipse(half_size, half_size, size, size);
		   
		if(this.life_stage === 'seedling'){
			drawSeedlingState(size, this.rainfall); 
		}
		else if(this.life_stage === 'tree'){
			drawTree(size);
		}
		else if(this.life_stage === 'fruit'){
			drawFeijoa(size);
		}  
	}
}

/**
* draws the seedling state
* @param {Number} size           - determines how big the seedling will be
*/
function drawSeedlingState(size, rainfall){
	//first create an array of raindrops
	var rainfall = floor(rainfall/4);
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


/**
 * draws a feijoa 
 * @param {Number} size       	  - determines how big the feijoa will be
 * @param {Number} maturity       - the 'G' value of the fill colour for the main shapes of the feijoa
 * @param {Number} ripeness       - the 'A' value of the fill colour for the main shapes of the feijoa
 */
function drawFeijoa(size, maturity = 205, ripeness = 255){
	stroke(25,68,14);
	strokeWeight(size*0.0234375);
	fill(128, maturity, 0, ripeness);
	
	triangle(size*0.421875, size*0.046875, size*0.484375, size*0.125, size*0.46875, size*0.03125);
	
	triangle(size*0.531250, size*0.046875, size*0.500000, size*0.125, size*0.59375, size*0.06250);
	
	ellipse(size*0.5, size*0.5, size*0.625, size*0.8046875);
	
	noFill();
	stroke(40,95,30);
	
	arc(size*0.5, size*0.484375, size*0.562500, size*0.7812500, PI+HALF_PI, TWO_PI+HALF_PI*0.85);
	
	stroke(25,68,14);
	
	arc(size*0.5, size*0.500000, size*0.546875, size*0.8046875, PI+HALF_PI, TWO_PI-QUARTER_PI*1.2);
	
	strokeWeight(0);
	fill(18,62,11);
	
	ellipse(size*0.625000, size*0.625000, size*0.03125);
	ellipse(size*0.687500, size*0.562500, size*0.03125);
	ellipse(size*0.656250, size*0.500000, size*0.03125);
	ellipse(size*0.593750, size*0.718750, size*0.03125);
	ellipse(size*0.656250, size*0.687500, size*0.03125);
	ellipse(size*0.625000, size*0.656250, size*0.03125);
	ellipse(size*0.531250, size*0.750000, size*0.03125);
	
	fill(50,95,40);
	
	ellipse(size*0.625000, size*0.546875, size*0.03125);
	ellipse(size*0.562500, size*0.531250, size*0.03125);
	ellipse(size*0.546875, size*0.562500, size*0.03125);
	ellipse(size*0.593750, size*0.437500, size*0.03125);
	ellipse(size*0.656250, size*0.468750, size*0.03125);
}
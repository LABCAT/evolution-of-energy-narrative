function Agent1() {
	//the life stage of the agent
	this.life_stage = 'seedling';
	//maturity of the seedling and fruit - ranges from 0-205
	this.maturity = 0;
	//ripeness of the fruit - ranges from 7-255
	this.ripeness = 7;

	// setup is run when the agent is reset
	// value is a number between 0 and 100
	this.setup = function(value) {
		//if the value > 95 then the agent will be a tree
		if(value > 95) {
		  this.life_stage = 'tree';
		}
		//otherwise it will be a seedling
		else {
		  this.life_stage = 'seedling';
		}
	}

	// this happens generally on mouse over
	this.activate = function() {
		this.life_stage = 'tree';
	}

	// decide on your next move based on neighbors (but don't do it yet)
	this.step = function(neighbors) {
		var num_trees_nearby = 0;
		var num_fruit_nearby = 0;
		//calculate how many of the nearby neighbors are trees or fruit
		for(var i =0; i < neighbors.length; i++){
			if(neighbors[i].agent.life_stage === 'tree'){
				num_trees_nearby++;
			}
			if(neighbors[i].agent.life_stage === 'fruit'){
				num_fruit_nearby++;
			}
		}

		//if current life stage is a seedling
		if(this.life_stage === 'seedling'){
			this.next_life_stage = 'seedling';
			//if maturity is greater than 200
			if(this.maturity > 200){
				//and the number of trees or fruit nearby is greater than 2
				if(num_trees_nearby > 2 || num_fruit_nearby > 2){
					//then the next life stage is a tree
					this.next_life_stage = 'tree';
				}
			}
			//otherwise
			else {
				//the maturity level increases if less than 200
				if(this.maturity < 200){
					this.maturity += 10.25;
				}
			}
		}
		//if current life stage is a tree
		else if(this.life_stage === 'tree'){
			this.next_life_stage = 'tree';
			//if number of trees nearby is greater than 4
			if(num_trees_nearby > 4){
				//then the next life stage is fruit
				this.next_life_stage = 'fruit';
			}
		}
		//if current life stage is a fruit
		else if(this.life_stage === 'fruit'){
			this.next_life_stage = 'fruit';
			//if the fruit is not ripe yet, increase the ripeness
			if (this.ripeness < 255){
				this.ripeness += 8;
			}
			//if the fruit is ripe and also mature then it starts to rot
			else if (this.maturity > 0){
				this.maturity -= 5;
			}
			//once the fruit is completly rotten, then the agent reverts to its original state as a seedling
			else {
				this.next_life_stage = 'seedling';
				this.maturiy = 0;
				this.ripeness = 7;
			}
		}
	}

	// execute the next move you decided on
	this.update_state = function() {
		this.life_stage = this.next_life_stage;
	}

	this.draw = function(size) {
		stroke(0);
		noStroke();
		if(this.life_stage === 'seedling'){
			drawSeedlingState(size);
		}
		else if(this.life_stage === 'tree'){
			drawTree(size);
		}
		else if(this.life_stage === 'fruit'){
			drawFeijoa(size, this.maturity, this.ripeness);
		}    
	}
}


/**
 * draws the seedling state
 * @param {Number} size       	  - determines how big the seedling will be
 */
function drawSeedlingState(size){
	//first create an array of raindrops
	var raindrops = [];
	for (var i = 0; i <= 32; i++) {
		raindrops.push(new rainDrop(size));
	}
	//the animate the rain drops to simulate rain
	for (var i = 32; i >= 0; i--) {
		raindrops[i].move();
		raindrops[i].draw();
		if (raindrops[i].y >= size) {
		  raindrops[i].y = 0;
		}
	}
	//draw a sun in the top right hand corder
	fill(255,204,26);
	arc(size, 0, size/2, size/2, 0+HALF_PI, PI);
	//draw the grass at the bottom of the square
	fill(51, 200, 25);
	rect(0, size - size/16, size, size/16);
	//finally, draw the seedling at the bottom of the square
	//fill(128,0,0);
	//ellipse(0 + size/2, size -size/12, size/8, size/8);
	fill(128,0,0);
	rectMode(CENTER);
	rect(0 + size/2, size -size/12, size/32, size/8);
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
 * @param {Number} size       	  - determines how big the raindrop will be
 */
function rainDrop(size) {
	//set the size of the rain drop
	this.size = size;
	//set the x position of the rain drop
	this.x = random((size/32), (size - size/32));
	//set the y position of the rain drop
	this.y = random((size/32), (size - size/32));

	//the move function increase the y value of the rain drop
	this.move = function() {
		if(this.y < this.size){
			this.y += random(3);
		}
	};

	//the draw function draws the rain drop
	this.draw = function() {
		strokeWeight(0);
		fill(86, 170, 255, 255);
		ellipse(this.x, this.y, size/32, size/32);
	};
}

/**
 * draws a tree 
 * @param {Number} size       	  - determines how big the tree will be
 */
function drawTree(size){
	fill(5, 205, 30);
	rect(0 + size/4, size - size/4, size/2, size/4);
	triangle(0, size-size/8, size/2, size/4, size, size-size/8);
	triangle(0+size/8, size-size/2, size/2, 0, size-size/8, size-size/2);
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
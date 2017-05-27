function Agent1() {
  // any variables you add here are for your own internal state
  this.is_seed = 0;
  
  this.is_tree = false;

  this.is_fruit = false;

  this.ripeness = 7;
      
  this.age = 205;

  // setup is run when the agent is reset
  // value is a number between 0 and 100
  this.setup = function(value) {
    if(value > 95) {
      this.is_tree = true;
    }
    else {
      this.is_tree = false;
    }
  }

  // this happens generally on mouse over
  this.activate = function() {
    this.is_tree = true;
  }

  // decide on your next move based on neighbors (but don't do it yet)
  this.step = function(neighbors) {
    var num_neighbors_alive = 0;
    for(var i =0; i < neighbors.length; i++){
      if(neighbors[i].agent.is_tree){
        num_neighbors_alive++;
      }
    }

    if(num_neighbors_alive > 2 && !this.is_tree && !this.is_fruit && this.is_seed > 10){
      this.next_tree_state = true;
    }
    else if(num_neighbors_alive > 4 && this.is_tree && !this.is_fruit){
      this.next_fruit_state = true;
      this.next_tree_state = false;
    }
    else if (this.is_fruit && this.ripeness < 255){
      this.ripeness += 8;
    }
    else if (this.is_fruit && this.ripeness > 254 && this.age){
      this.age -= 5;
    }
    else if (this.is_fruit && !this.age){
      this.next_fruit_state = false;
      this.ripeness = 7;
      this.age = 205;
	  this.is_seed = 0;
    }
    else {
      this.next_tree_state = this.is_tree;
      this.next_fruit_state = this.is_fruit;
	  this.is_seed += 1;
    }
  }

  // execute the next move you decided on
  this.update_state = function() {
    this.is_tree = this.next_tree_state;
    this.is_fruit = this.next_fruit_state;
  }

  this.draw = function(size) {
    stroke(0);
    noStroke();
    if(this.is_tree || this.is_fruit) {
      if(this.is_fruit){
        drawFeijoa(size, this.age, this.ripeness);
      }
      else {
        fill(5, 205, 30);
        drawTree(size);
      }
      
    }
    else {
      drawSeedling(size);
    }
    
  }
}

function drawSeedling(size){
	var raindrops = [];
	for (var i = 0; i <= 32; i++) {
		raindrops.push(new rainDrop(size));
	}
	for (var i = 32; i >= 0; i--) {
		raindrops[i].move();
		raindrops[i].display();
		if (raindrops[i].y >= height) {
		  raindrops[i].y = 0;
		}
	}
	fill(255,204,26);
	arc(size, 0, size/2, size/2, 0+HALF_PI, PI);
	fill(51, 200, 25);
	rect(0, size - size/16, size, size/16);
	fill(128,0,0);
	ellipse(0 + size/2, size -size/12, size/8, size/8);
}

function drawTree(size){
  rect(0 + size/4, size - size/4, size/2, size/4);
  triangle(0, size-size/8, size/2, size/4, size, size-size/8);
  triangle(0+size/8, size-size/2, size/2, 0, size-size/8, size-size/2);
}

function drawFeijoa(size, lifeLeft = 205, ripeness = 255){
	stroke(25,68,14);
	strokeWeight(size*0.0234375);
	fill(128, lifeLeft, 0, ripeness);
	
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

function rainDrop(size) {
  this.size = size;
  this.x = random((size/32), (size - size/32));
  this.y = random((size/32), (size - size/32));

  this.move = function() {
	if(this.y < this.size){
		this.y += random(3);
	}
  };

  this.display = function() {
	strokeWeight(0);
	fill(86, 170, 255, 255);
    ellipse(this.x, this.y, size/32, size/32);
  };
}

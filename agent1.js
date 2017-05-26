function Agent1() {
  // any variables you add here are for your own internal state
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

    if(num_neighbors_alive > 2 && !this.is_tree && !this.is_fruit){
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
    }
    else {
      this.next_tree_state = this.is_tree;
      this.next_fruit_state = this.is_fruit;
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
        fill(128, this.age, 0, this.ripeness);
        drawFruit(size);
      }
      else {
        fill(5, 205, 30);
        drawTree(size);
      }
      
    }
    else {
      drawSeed(size);
    }
    
  }
}

function drawSeed(size){
  fill(51, 200, 205);
  rect(0, 0, size, size);
  fill(128,0,0);
  ellipse(0 + size/2, 0 + size/2, size/8, size/8);
}

function drawTree(size){
  rect(0 + size/4, size - size/2, size/2, size/2);
  triangle(0, size-size/8, size/2, size/4, size, size-size/8);
  triangle(0+size/8, size-size/2, size/2, 0, size-size/8, size-size/2);
}

function drawFruit(size){
  ellipse(0 + size/2, 0 + size/2, size, size);
}

function Agent1() {
  // any variables you add here are for your own internal state
  this.is_alive = false;

  // setup is run when the agent is reset
  // value is a number between 0 and 100
  this.setup = function(value) {
    if(value > 95) {
      this.is_alive = true;
    }
    else {
      this.is_alive = false;
    }
  }

  // this happens generally on mouse over
  this.activate = function() {
    this.is_alive = true;
  }

  // decide on your next move based on neighbors (but don't do it yet)
  this.step = function(neighbors) {
    var num_neighbors_alive = 0;
    for(var i =0; i < neighbors.length; i++){
      if(neighbors[i].agent.is_alive){
        num_neighbors_alive++;
      }
    }

    if(num_neighbors_alive > 4 && !this.is_alive){
      this.next_alive = true;
    }
    else if(num_neighbors_alive == 2 && !this.is_alive){
      this.next_alive = 2;
    }
    else {
      this.next_alive = this.is_alive;
    }
  }

  // execute the next move you decided on
  this.update_state = function() {
    this.is_alive = this.next_alive;
  }

  this.draw = function(size) {
    stroke(0);
    if(this.is_alive) {
      if(this.is_alive == 2){
        fill(05, 205, 0);
        drawFruit(size);
      }
      else {
        fill(205, 0, 0);
        drawTree(size);
      }
      
    }
    else {
      fill(0, 0, 30);
      rect(0, 0, size, size);
    }
    
  }
}

function drawFruit(size){
  ellipse(0 + size/2, 0 + size/2, size, size);
}

function drawTree(size){
  rect(0 + size/4, size - size/2, size/2, size/2);
  triangle(0, size-size/8, size/2, size/4, size, size-size/8);
  triangle(0+size/8, size-size/2, size/2, 0, size-size/8, size-size/2);
}
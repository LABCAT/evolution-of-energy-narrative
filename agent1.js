function Agent1() {
  // any variables you add here are for your own internal state
  this.is_alive = false;

  // setup is run when the agent is reset
  // value is a number between 0 and 100
  this.setup = function(value) {
    if(value > 50) {
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
    this.next_alive = false;
  }

  // execute the next move you decided on
  this.update_state = function() {
    this.is_alive = this.next_alive;
  }

  this.draw = function(size) {
    stroke(0);
    if(this.is_alive) {
      fill(200, 200, 0);
    }
    else {
      fill(0, 0, 30);
    }
    rect(0, 0, size, size);
  }
}

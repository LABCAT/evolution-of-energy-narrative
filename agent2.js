function Agent2() {
  // any variables you add here are for your own internal state
  this.power = 0.0;
  this.next_power = 0.0;

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
      if(neighbors[i].y < 0) {
        if(neighbors[i].agent.power > max_power) {
          max_power = neighbors[i].agent.power;
        }
      }
    }
    this.next_power = 0.8 * max_power;
    if(this.next_power > 100) {
      this.next_power = 100;
    }
  }

  // execute the next move you decided on
  this.update_state = function() {
    this.power = this.next_power;
  }

  this.draw = function(size) {
    var half_size = size/2;
    var low = color(220, 220, 200);
    var high = color(0, 0, 50);
    var c = lerpColor(low, high, this.power / 100.0);
    stroke(0);
    fill(c);
    ellipse(half_size, half_size, size, size);
  }
}

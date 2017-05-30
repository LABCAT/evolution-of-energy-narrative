function Agent3Preload() {  
}

function Agent3() {
  // any variables you add here are for your own internal state

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
  this.step = function(neighbors, radius) {
    var surrounding_power = 0;
    var death_limit1 = 49.99;
    var death_limit2 = 50.01;
    for(var i=0; i<neighbors.length; i++) {
      surrounding_power = surrounding_power + neighbors[i].agent.power;
    }
    var avg_power = surrounding_power / neighbors.length;
    if(this.agent_type == 0) {
      if(avg_power < death_limit1) {
        this.power = 0;
      }
      else {
        this.power = 100;
      }
    }
    else {
      if(avg_power < death_limit2) {
        this.power = 0;
      }
      else {
        this.power = 100;
      }
    }
  }

  this.draw = function(radius) {
    var brighness = map(this.power, 0, 100, 0, 255);
    fill(brighness);
    ellipse(0, 0, radius*2, radius*2);
  }
}

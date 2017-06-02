function Agent3Preload() {  
}

function Agent3() {
  // any variables you add here are for your own internal state

  // setup is run when the agent is reset
  // value is a number between 0 and 100
  this.setup = function(value, agent_type) {
    this.power = value;
    //the five agent types are represented as follows
    //0 = metal
    //1 = earth
    //2 = fire
    //3 = wood
    //4 = water
    this.agent_type = agent_type;
    this.number_steps = int(random(0,10));
    this.current_direction = p5.Vector.random2D();
  }

  // this happens generally on mouse over
  this.activate = function() {
    this.power = 100.0;
  }

  // decide on your next move based on neighbors (but don't do it yet)
  this.step = function(neighbors, radius) {
    this.close = false;
    if(this.agent_type >= 1) {
      this.number_steps = this.number_steps - 1;
      if(this.number_steps < 0) {
        this.number_steps = 30;
        this.current_direction = p5.Vector.random2D();
      }
      v = this.current_direction.copy().mult(radius/10);
      for(var i=0; i<neighbors.length; i++) {
        var npos = neighbors[i].pos;
        var d = npos.mag();
        if ((d > 0) && (d < radius + neighbors[i].radius)) {
          this.close = true;
          // Calculate vector pointing away from neighbor
          var move_away = npos.mult(-1);
          move_away.normalize();
          move_away.div(d*0.1);        // Weight by distance
          v.add(move_away);
          if(this.agent_type == 1){
            if(neighbors[i].agent.agent_type  == 2){
              this.agent_type = 0;
            }
            else if(neighbors[i].agent.agent_type  == 4){
              this.agent_type = 3;
            }
          }
          else if(this.agent_type == 2){
            if(neighbors[i].agent.agent_type  == 4){
               this.agent_type = 1;
            }
          }
          else if(this.agent_type == 3){
            if(neighbors[i].agent.agent_type  == 2){
              this.agent_type = 1;
            }
          }  
        }
      }
      return v;
    }
  }

  this.draw = function(radius) {
    stroke(0);
    var size = radius * 2;
    if(this.close) {
      fill(255, 255, 0);
    }
    else if(this.agent_type >= 1) {
      var size = radius * 2;
    }
    if(this.agent_type == 0) {
      fill(0);
    }
    else if(this.agent_type == 1) {
      fill(255);
    }
    else if(this.agent_type == 2) {
      fill(255, 0, 0);
    }
    else if(this.agent_type == 3) {
      fill(0, 255, 0);
    }
    else if(this.agent_type == 4) {
      fill(0, 0, 255);
    }
    ellipse(0, 0, size, size);
  }
}

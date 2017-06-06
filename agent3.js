//their are five phases used to describe the current state of nature
//the earth phase is a shorter phase that occurs in between each of the other phase
var phases_of_nature  = [
				['earth', 18],
				['wood', 72],
				['earth', 18],
				['fire', 72], 
				['earth', 18], 
				['metal', 72], 
				['earth', 18], 
				['water', 72]
			];

//the sun is located in the center of the canvas
//it changes colour in sync with the phases of nature
var sun_colours = {
				'earth' : '#fbc02d', 
				'wood' : '#f9a825',  
				'fire'  : '#f57f17',
				'metal'  : '#ffeb3b	',  
				'water' : '#fdd835'   
			}
			
//keeps track of which phase is the current state			
var phase_pointer = 0;

//current phase
var current_phase = 'earth';

//days remaining in this phase 
var days_remaining = 18;

//the five agent types are represented as follows
//these agent types can be created during their phase of nature
//there is an extra agent type 'sun' which is only generated on setup
var elements = [
				'earth',
				'metal',
				'fire',
				'wood',
				'water'
				];
				
//a JSON object containing arrays of three colours for each of the elements
var element_colours = {
				'earth' : ['#a1887f', '#3e2723', '#6d4c41'],
				'metal' : ['#e0e0e0', '#212121', '#757575'],
				'fire'  : ['#e57373', '#b71c1c', '#e53935'],
				'wood'  : ['#81c784', '#1b5e20', '#43a047'],
				'water' : ['#64b5f6', '#0d47a1', '#1e88e5']
			};

//if an agent collides with a particular neighbour its size will be increased
var generated_by = {
					'metal' : 'earth', //metal is generated by earth
					'water' : 'metal', //water is generated by metal  
					'wood'  : 'water', //wood is generated by water  
					'fire'  : 'wood',  //fire is generated by wood 
					'earth' : 'fire'   //earth is generated by fire
				};
				
//if an agent collides with a particular neighbour it will be overcome by it and change to its state				
var overcome_by = {
					'earth' : 'wood', //earth is overcome by water
					'metal' : 'fire',  //metal is overcome by fire
					'water' : 'earth', //water is overcome by earth
					'wood'  : 'metal', //wood is overcome by metal
					'fire'  : 'water'  //fire is overcome by water
				};

function Agent3Preload() {  

}				

function Agent3() {
  //max size determines how big an agent can be 
  this.max_size = 0;
  //size_adjuster is the amount that the size of an agent will increase or decreae by when changing size
  this.size_adjuster = 0;
  //variable used to prevent the size from changing to easily
  this.steps_between_size_change = 1;
  //number_steps determines how many steps an agent will take before changing direction
  this.number_steps = 0;

  // setup is run when the agent is reset
  // value is a number between 0 and 100
  this.setup = function(value, agent_type, agent_size) {
  	//during setup the only agent type greater than 0 are setup
   	if(agent_type > 0){
	   	//set the agent_type using the elements array
	    this.agent_type = elements[agent_type];
	    this.max_size = agent_size;
	    this._size = this.max_size/4;
	    this.size_adjuster = this.max_size/4;
    }
    //0 is not set up because instead an extra agent type 'sun' is created
    //this agent type is the only truly static agent type
    //it is not not affected by other agents, it does not move and it does not change size
    else {
    	this.agent_type = 'sun';
    	this._size = agent_size * 2;
    }
  }

  // this happens generally on mouse over
  // this function is not used in this simulation
  this.activate = function() {

  }

  // decide on your next move based on neighbors (but don't do it yet)
  this.step = function(neighbors, radius) {
	//the sun is always static and not affected by its neighbours
  	if(this.agent_type == 'sun'){
  		return;
  	}

  	var become_current_phase = random(0, 100);
  	//there is a 0.1% chance that an agent will be reborn as the element of the current phase
  	//this ensure that none of the 5 different agent types will evey become extinct
  	if(become_current_phase < 0.1){
  		this.agent_type = current_phase;
		//when an agent is reborn it's size is reset to its original size
		this._size = this.size_adjuster;
  	}

	//calculate the direction to travel every 10 steps
	this.number_steps = this.number_steps - 1;
	if(this.number_steps < 0) {
		this.number_steps = 20;
		this.current_direction = calculateDirection(this._x, this._y, radius);
	}
	v = this.current_direction.copy().mult(radius/2);

	for(var i=0; i<neighbors.length; i++) {
		var npos = neighbors[i].pos;
		var d = npos.mag();
		//if there is a collision then the agent may change state or increase size depending on which agent it has collided with
		if ((d > 0) && (d < radius + neighbors[i].radius)) {
			// Calculate vector pointing away from neighbor
			var move_away = npos.mult(-3);
			move_away.normalize();
			move_away.mult(d*.3); // Weight by distance
			v.add(move_away);
			//an agent will only increase in size if it is equal to the current_phase and collides with an agent that it is generated by
			if(this.agent_type == current_phase && neighbors[i].agent.agent_type  == generated_by[this.agent_type]){
				this.steps_between_size_change -= 1; 
				//make sure the value for size is never higher than the max size
				if(this._size < this.max_size && this.steps_between_size_change == 0) {
					this._size += this.size_adjuster;
					this.steps_between_size_change = 20;
				}
			}
			
			//if an agent collides with an agent that it is overcome by
			if(neighbors[i].agent.agent_type  == overcome_by[this.agent_type]){
				//the agent will change to a new agent if is not equal to the current_phase 
				if(this.agent_type != current_phase){
					this.agent_type = overcome_by[this.agent_type];
				}
				//otherwise it will just decrease in size
				else {
					this.steps_between_size_change -= 1;
					if(this._size > this.size_adjuster && this.steps_between_size_change == 0) {
						this._size -= this.size_adjuster;
						this.steps_between_size_change = 20;
					}
				}
			}
		}
	}
	
	return v;
  }

  this.draw = function(radius) {
    var size = radius * 4;

    if(this.agent_type == 'sun'){
		strokeWeight(0);
    	fill(sun_colours[current_phase]);
    	hexagon(0, 0, size/4);
    }
    else {
		this.drawElement(size);
    }   
	
  }
  
	/*
	 * function used to draw the three circlies that represent the element
	 * @param {Number} size   - size of the outer circle
	 */
	this.drawElement = function(size) {
		stroke(255);
		strokeWeight(1);
		fill(element_colours[this.agent_type][2]);
		ellipse(0, 0, size, size);
		
		strokeWeight(0);
		fill(element_colours[this.agent_type][1]);
		ellipse(0, 0, size*0.66, size*0.66);
		
		strokeWeight(0);
		fill(element_colours[this.agent_type][0]);
		ellipse(0, 0, size*0.25, size*0.25);
	}
}

/*
 * function to draw a hexagon shape
 * adapted from: https://p5js.org/examples/form-regular-polygon.html
 * @param {Number} x       	- x-coordinate of the hexagon
 * @param {Number} y    	- y-coordinate of the hexagon
 * @param {Number} radius   - radius of the hexagon
 */
function hexagon(x, y, radius) {
  angleMode(RADIANS);
  var angle = TWO_PI / 6;
  beginShape();
  for (var a = TWO_PI/12; a < TWO_PI + TWO_PI/12; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

/*
 * function to calculate which direction an agent should travel
 * the agents are always trying to travel anti-clockwise around the sun
 * inspired by the movement functionality implemented here: http://bl.ocks.org/HenryLeungVuw/4af688077859644d566f6a9cb2dccad3/5e68663fd84288a41a2301a15410e76cc01e1f1c
 * @param  {Number} x       	- current x position of the agent
 * @param  {Number} y    		- current y position of the agent
 * @param  {Number} size     	- current size of the agent
 * @return {Vector} 	     	- the direction the agent should travel
 */
function calculateDirection(x, y, size){
	var dirX = 480 - x;
	var dirY = 250 - y;
	var vX = 0;
	var vY = 0;
	var movement = size / 4;
	//bottom right hand corner of the canvas
	if(dirY >= 0 && dirX >= 0){
		vX = -movement;
		vY = movement;
	}
	//top left hand corner of the canvas
	else if(dirY < 0 && dirX < 0){
		vX = movement;
		vY = -movement;
	}
	//bottom left hand corner of the canvas
	else if(dirY >= 0 && dirX < 0){
		vX = -movement;
		vY = -movement;
	}
	//top right hand corner of the canvas
	else if(dirY < 0 && dirX >= 0){
		vX = movement;
		vY = movement;
	}
	return createVector(vX, vY);
}
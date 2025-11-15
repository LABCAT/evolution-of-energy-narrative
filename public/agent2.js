function Agent2() {
    //the life stage of the agent
    this.life_stage = 'seedling';
    //maturity of the seedling and fruit - ranges from 0-205
    this.maturity = 0.0;
    this.next_maturity = 0.0;
    //ripeness of the fruit - ranges from 7-255
    this.ripeness = 7;
    this.next_ripeness = 7;
    //the amount of rainfall in a cell - ranges from 0-205
    this.rainfall = 0.0;
    this.next_rainfall = 0.0;
    

    // setup is run when the agent is reset
    // value is a number between 0 and 100
    this.setup = function(value, agent_type) {
        this.rainfall = value;
        this.next_rainfall = this.rainfall;
        this.agent_type = agent_type;
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
            //if it has been raining in a neighboring agent then it will start raining in this agent
            if(neighbors[i].agent.rainfall > todays_rainfall) {
                todays_rainfall = neighbors[i].agent.rainfall;
            }
            //if the neighbor is a tree add it to the number of trees nearby
            if(neighbors[i].agent.life_stage === 'tree'){
                if(this.agent_type == 0) {
                    num_trees_nearby++;
                }
                //in this climate only keep track on the nubmber of trees nearby on the x axis
                else if(this.agent_type && neighbors[i].y == 0){
                    num_trees_nearby++;
                }
            }
        }
        //the different agent types represent different type of climates
        //in one climate it rains more than in the other
        if(this.agent_type == 0) {
            this.next_rainfall = 0.8 * todays_rainfall;
        }
        else {
            this.next_rainfall = 0.6 * todays_rainfall;
        }
        //the rainfall should never be greater than 100
        if(this.next_rainfall > 100) {
          this.next_rainfall = 100;
        }
        //if there is very little rainfall
        else if(this.next_rainfall < 1){
            var will_it_rain = floor(random(1, 100));
            //then there is 1% chance of a storm
            if(will_it_rain < 2){
               this.activate();
            }
        }

        //if current life stage is a seedling
        if(this.life_stage === 'seedling'){
            this.next_life_stage = 'seedling';
            //if the seedling has received enough rain to mature, it becomes a tree
            if(this.maturity > 200){
                this.next_life_stage = 'tree';
                this.next_maturity = 205;
            }
            //otherwise it continues to mature
            else {
                this.next_maturity = this.maturity + this.next_rainfall/5;
            }
        }
        //if current life stage is a tree
        else if(this.life_stage === 'tree'){
            this.next_life_stage = 'tree';
            //if the agent_type is 1 and the number of trees nearby is greater than 1 or the number of trees nearby is greater than 3
            if((num_trees_nearby > 1 && this.agent_type) || num_trees_nearby > 4){
                //then the next life stage is fruit
                this.next_life_stage = 'fruit';
            }
        }
        //if current life stage is a fruit
        else if(this.life_stage === 'fruit'){
            this.next_life_stage = 'fruit';
            //if the fruit is not ripe yet, increase the ripeness
            if (this.ripeness < 255){
                this.next_ripeness = this.ripeness + 8;
            }
            //if the fruit is ripe and also mature then it starts to rot
            else if (this.maturity > 0){
                this.next_maturity = this.maturity - 5;
            }
            //once the fruit is completly rotten, then the agent reverts to its original state as a seedling
            else {
                this.next_life_stage = 'seedling';
                this.next_maturity = 0;
                this.next_ripeness = 7;
            }
        }
    }

    // execute the next move you decided on
    this.update_state = function() {
        this.rainfall = this.next_rainfall;
        this.life_stage = this.next_life_stage;
        this.ripeness = this.next_ripeness;
        this.maturity = this.next_maturity;
    }

    this.draw = function(size) {
        var low, high = color(100, 100, 100);
        //determine the background colour of the agent based on whether or not it is fruit or its agent type
        if(this.life_stage === 'fruit'){
            low = color(232,232,232);
        }
        else {
            if(this.agent_type == 0) {
              low = color(86, 170, 225);
            }
            else {
              low = color(220, 122, 4);
            }
        }
        var c = lerpColor(low, high, this.rainfall / 100.0);
        strokeWeight(0);

        //the rain effect only applies to seedlings 
        if(this.life_stage === 'seedling'){
            fill(c);
        }
        else {
            fill(low);
        }

        ellipse(size/2, size/2, size, size);


        if(this.life_stage === 'seedling'){
            drawSeedlingState(size, this.rainfall);
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

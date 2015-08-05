/**
 * @global {array} for up to 3 enemy objects
 * @global {object} for one player object
 * @global {object} for indicating lost
 * @global {object} for storing score
 * @global {object} score DOM element
 */
var allEnemies = [];
var Player;
var isGameOver;
var score;
var scoreEl;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.direction = 'left';
    this.moveWithRandonSpeed();
    this.width = 98;
    this.height = 80;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if(this.x > 500){
        this.moveWithRandonSpeed();
    } 
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.moveWithRandonSpeed = function(){
    this.x = randomX();
    this.y = randomY();
    this.speed = randomSpeed();
    
    function randomY(){
        var yPoints = [60, 140, 220];
        return yPoints[Math.floor(Math.random() * 3)];
    }
    
    function randomX(){
        return -100 * Math.floor(Math.random() * 2);
    }
    
    function randomSpeed(){
        return 50 * (1 + Math.floor(Math.random() * 3));
    }
};

var Gem = function(){
    this.Sprite = '';
}

/**
 * Player Object
 */
Player = function(){
  this.sprite = 'images/char-pink-girl.png';
  this.heartSprite = 'images/Heart.png';
  this.direction = 'left'; 
  this.x = 200;
  this.y = 400; 
  this.width = 90;
  this.hearts = 3;
};

//Move the player back to the initial location
Player.prototype.resetLocation = function(){
    this.x = 200;
    this.y = 400;
};

//Check x and y values not to go out of the border
Player.prototype.onRightLimit = function(){
    if(this.x >= 400){
        return true;
    }
    return false;    
};

Player.prototype.onLeftLimit = function(){
    if(this.x <= 20){
        return true;
    }
    return false;    
};

Player.prototype.onUpLimit = function(){
    if(this.y <= 10){
        //add to score
        getScore('up');
        this.resetLocation();
        return true;
    }
    return false;    
};

Player.prototype.onDownLimit = function(){
    if(this.y >= 400){
        return true;
    }
    return false;    
};

Player.prototype.update = function(dt){
    if(collisionDetect(allEnemies, player)){
        this.resetLocation();
        (this.hearts != 0) && (this.hearts--);
    }
};

//render the player
Player.prototype.render = function(){
  var max_hearts = 3, i = 0;
  
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  
  for(i = 0; i < this.hearts; i++){
      var x = 50 * i;
      var y = -23;
      ctx.drawImage(Resources.get(this.heartSprite), x, y);
  }
  for(; i < max_hearts; i++) {
    var x = 50 * i;
    var y = -23;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y, 400, 70);  
    (this.hearts == 0) && (gameOver());
  }
};

Player.prototype.handleInput = function(direction){
  this.direction = direction; 
  switch(direction){
     case 'left':
        ((!this.onLeftLimit()) && ( this.x -= 50));
        break;
     case 'right':
        (!this.onRightLimit()) && ( this.x += 50);
        break;
     case 'up': 
        (!this.onUpLimit()) && (this.y -= 50);
        break;
     case 'down':
        (!this.onDownLimit()) && ( this.y += 50);
        break;    
  }  
};


/**
 * @param {number} keyup current key pressed
 * @param {function} function(e)
 * Adds an event listener to the DOM that listens for allowed keypresses
 * such as 'enter', to shuffle the player character, and the 'arrow keys', to
 * move the player in one of four directions. Passes the current pressed key to
 * the handleInput function.
 */
document.addEventListener('keyup', function(e) {
  
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(allowedKeys[e.keyCode] == null || allowedKeys[e.keyCode] == undefined)
       return;
    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * @param {number} click on 'play-again' button
 * @param {function} function(e)
 * Adds an event listener to the DOM that listens for click on the 'play-again'
 * button which restarts the game.
 */
document.getElementById('play-again').addEventListener('click', function() {
    restratGame();
});

/**
 * @function startGame
 * @param {number} numEnemies
 * @description The function startGame initializes all global objects (<= 3 enemies,
 * 1 player,  initial score = 0) necessary to start the game.
 */
function startGame(enemiesNumber){
    score = 0;
    scoreEl = document.getElementById('score'); 
    scoreEl.innerHTML = score;
    for(var i = 0; i < enemiesNumber; i++){
        allEnemies.push(new Enemy());
    }
    player = new Player();
}
//starting the game
startGame(3);


/**
 * @function collisionDetect
 * @params {array} enemies or gems, {object} the player
 * @description detects collision between player and other things
 * @return {boolean} indicates collision happened
 */
function collisionDetect(things, player){
    for(var i = 0; i < things.length; i++){
        if(player.x + player.width >= things[i].x && player.x <= things[i].x + things[i].width &&
           player.y >= things[i].y && player.y <= things[i].y + things[i].height){
            return true;
        };
        
    };
    return false;
}
/**
 * Game over function
 */
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}


/**
 * restarts game to original state
 */
function restratGame() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    score = 0;
    allEnemies = [];
    startGame(3);
};

/**
 * Calculates score
 */
 function getScore(type){
     switch(type){
         case 'up':
            score += 20;
            scoreEl.innerHTML = score;
            break;
         case 'gem':
            score += 5;
            break;   
     }
 }

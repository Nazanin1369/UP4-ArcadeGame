// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.direction = 'left';
    this.moveWithRandonSpeed();
    this.width = 101;
    this.height = 101;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
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
/**
 * Player Object
 */
var Player = function(){
  this.sprite = 'images/char-pink-girl.png';
  this.direction = 'left'; 
  this.x = 200;
  this.y = 400; 
  this.width = 90;
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
        this.resetLocation();
        return true;
    }
    return false;    
};

Player.prototype.onDownLimit = function(){
    if(this.y >= 420){
        return true;
    }
    return false;    
};

Player.prototype.update = function(dt){
    if(collisionDetect(allEnemies, player)){
        this.resetLocation();
    }
};

//render the player
Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  
};

Player.prototype.handleInput = function(direction){
  this.direction = direction; 
  switch(direction){
     case 'left':
        (!this.onLeftLimit()) && ( this.x -= 20);
        break;
     case 'right':
        (!this.onRightLimit()) && ( this.x += 20);
        break;
     case 'up': 
        (!this.onUpLimit()) && ( this.y -= 20); 
        break;
     case 'down':
        (!this.onDownLimit()) && ( this.y += 20);
        break;    
  }  

};

/**
 * Objects instantiations
 */
function createEnemies(enemiesNumber){
    var i, enemies = [];
    for(i = 0; i < enemiesNumber; i++){
        enemies.push(new Enemy());
    }
    return enemies;  
}
var allEnemies = createEnemies(3);

var player = new Player();

/** */
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
 * detects collision between player and other things
 */
function collisionDetect(things, player){
    for(var i = 0; i < things.length; i++){
        if(player.x + player.width >= things[i].x && player.x <= things[i].x + things[i].width &&
           player.y >= things[i].y && player.y <= things[i].y + things[i].height){
            return true;
        };
        return false;
    };
}

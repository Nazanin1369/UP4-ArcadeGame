/* jshint strict: true */
/**
 * @global {array} for up to 3 enemy objects
 * @global {object} for one player object
 * @global {object} for one gem object
 * @global {object} for indicating lost
 * @global {object} for storing score
 * @global {object} for soundEffects and backgrounf sound
 * @global {string} path to eatGem ".wav" file
 * @global {string} path to gameOver ".wav" file
 * @global {string} path to bugHit ".wav" file
 * @global {object} backsound audio element
 * @global {number} interval if for the setInterval function
 * to initialize gems. Using this in @Link{gameOver} function 
 * to clear the interval.
 */
var allEnemies = [];
var player;
var gem;
var isGameOver;
var score;
var soundEfx, backgroundSound; // Sound Efx
var soundEatGem = "sounds/gem.wav"; //Eat Gem sound efx
var soundGameOver = "sounds/gameOver.wav";
var soundHit = "sounds/hit.wav";
var backSound;
var gemItervId;

/**
 * @function Enemies
 * @description Enemies our player must avoid
 */
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.direction = 'left';
    this.moveWithRandonSpeed();
    this.width = 75;
    this.height = 50;
}

/**
 * @function update
 * @param {number}  a time delta between ticks
 * @description  Update the enemy's position, required method for game
 */
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if(this.x > 500){
        this.moveWithRandonSpeed();
    } 
};

/**
 * @function render
 * @description Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function moveWithRandonSpeed
 * @description sets up random x and y and speed for the enemy
 */
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
 * @function checkCollision
 * @description It checks whether the enemyBox and the playerBox are 
 * integrated.This is getting called by the checkCollision function in 
 * engine.js file.
 * @return {boolean} indicates whether collision happened or not.
 */
Enemy.prototype.checkCollision = function(){
     if(player.x + player.width >= this.x && player.x <= this.x + this.width &&
       player.y >= this.y && player.y <= this.y + this.height){
        soundEfx.src = soundHit;
        soundEfx.play();
        return true;
    };
    return false;
};

/**
 * @function player
 * @description sets up properties for the player
 */
Player = function(){
  this.sprite = 'images/char-pink-girl.png';
  this.heartSprite = 'images/heart.png';
  this.direction = 'left'; 
  this.x = 200;
  this.y = 400; 
  this.width = 90;
  this.hearts = 3;
};

/**
 * @function resetLocation
 * @description Moves the player back to the initial location
 */
Player.prototype.resetLocation = function(){
    this.x = 200;
    this.y = 400;
};

/**
 * @function onRightLimit
 * @description checks right boundaries for the player
 */
Player.prototype.onRightLimit = function(){
    if(this.x >= 400){
        return true;
    }
    return false;    
};

/**
 * @function onLeftLimit
 * @description checks left boundaries for the player
 */
Player.prototype.onLeftLimit = function(){
    if(this.x <= 20){
        return true;
    }
    return false;    
};

/**
 * @function onUpLimit
 * @description checks top boundaries for the player
 * Also if player reaches up it will call getScore(type) 
 * function and reset it s location.
 */
Player.prototype.onUpLimit = function(){
    if(this.y <= 10){
        //add to score
        score += 20;
        this.assignScore(score);
        this.resetLocation();
        return true;
    }
    return false;    
};

/**
 * @function onDownLimit
 * @description checks bottom boundaries for the player
 */
Player.prototype.onDownLimit = function(){
    if(this.y >= 400){
        return true;
    }
    return false;    
};
/**
 * @function update
 * @param {} 
 * @description checks whether the player collided with
 * any enemies if so calls resetLocation() function to
 * resets the player location.
 * Also checks on the number of players' hearts if not zore
 * if will decrement it once on each collision.
 */
Player.prototype.update = function(dt){
    
};

/**
 * @function render
 * 
 * @description draws the player and its related hearts
 * respectively. Also removes the extra heart by drawing 
 * a white rectangle when player looses hearts.
 */
Player.prototype.render = function(){
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);  
  for(i = 0; i < this.hearts; i++){
      var x = 50 * i;
      var y = -23;
      ctx.drawImage(Resources.get(this.heartSprite), x, y);
  }
};

/**
 * @function handleInput
 * @param {string} indicates the direction of the key pressed
 * 
 * @description checks the direction type of the input key and 
 * add relative value to the player position. So they player will
 * move toward that direction.
 */
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
 * @function gameOver
 * @description displays the game-over elements and 
 * sets the isGameOver value to true
 */
Player.prototype.gameOver = function(){
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
    backSound = false;
    backgroundSound.pause();
    soundEfx.src = soundGameOver;
    soundEfx.play();
    clearInterval(gemItervId);
};

/**
 * @function reduceHeart
 * @description  It removes the lost heart from the canvas
 * by drawing a white rectangle
 */
Player.prototype.reduceHeart = function(){
    var max_hearts = 3, i = 0;
    for(; i < max_hearts; i++) {
        var x = 50 * i;
        var y = -23;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x, y, 400, 70);  
        (player.hearts == 0) && (player.gameOver());
    }
}; 

/**
 * @function assignScore
 * @description it shows the score for the player
 */
Player.prototype.assignScore = function(score){
    var scoreEl = document.getElementById('score'); 
    scoreEl.innerHTML = score;
};

/**
 * @function gem
 * @description sets up game gems properties
 */
var Gem = function(){
    this.width = 50;
    this.height = 50;
    this.imageURLs = [
      'images/gem-blue.png',
      'images/gem-green.png',
      'images/gem-orange.png',
      'images/key.png',
      'images/rock.png',
      'images/star.png'
      ];
    this.initialize();
};

/**
 * @function init
 * @description The function initalizes the current gem. The gem gets a random image url
 * string and a random x and y position value.
 */
Gem.prototype.initialize = function(){
    this.sprite = this.getRandomImageURL();
    this.x = getRandomValue(0, 4) * 101;
    this.y = getRandomValue(1, 3) * 70;
    console.log(this.x, this.y, this.sprite);
};

/**
 * @function getRandomImageURL
 * @returns one random image url string for the gem sprite.
 */
Gem.prototype.getRandomImageURL = function() {
    var gemImageURLs = this.imageURLs,
        imageURL = getRandomValue(0, gemImageURLs.length - 1);
    return gemImageURLs[imageURL];
};

/**
 * @function render
 * @description The function draws the current gem sprite onto the canvas.
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    console.log("render", this.sprite, this.x, this.y)
};

/**
 * @function hide
 * @description The function puts the gem off canvas after it has been collected by the player.
 * It also checks whether the player character matches with the gem-player list.
 * If yes, it multiplies the value of the current gem by ten. If not, it adds
 * the normal gem value to the players score.
 */
Gem.prototype.hide = function() {
    this.x = -100;
    this.y = -100;
};

/**
 * @function checkCollision
 * @description It checks whether the gemBox and the playerBox are 
 * integrated.This is getting called by the checkCollision function in 
 * engine.js file.
 * @return {boolean} indicates whether collision happened or not.
 */
Gem.prototype.checkCollision = function(){
    if(player.x + player.width >= this.x && player.x <= this.x + this.width &&
       player.y >= this.y && player.y <= this.y + this.height){
        score += this.gemScoreList();   
        player.assignScore(score);
        soundEfx.src = soundEatGem;
        soundEfx.play();
        return true;
    };
    return false;
};

/**
 * @function gemScoreList
 * @returns the current gem's value from the gem-score object
 */
Gem.prototype.gemScoreList = function() {
    var gemScore = {
          'blue': 10,
          'green': 20,
          'orange': 30,
          'key': 100,
          'rock': 0,
          'star': 50
    },
    currentgem = this.sprite;
    for (var g in gemScore) {
      if (currentgem.match(g)) {
        return gemScore[g];
      }
    }
    return 0; // fallback
};

/**
 * @param {number} keyup current key pressed
 * @param {function} function(e)
 * @description Adds an event listener to the DOM that listens for allowed keypresses
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
 * @description Adds an event listener to the DOM that listens for click on the 'play-again'
 * button which restarts the game.
 */
document.getElementById('play-again').addEventListener('click', function() {
    restratGame();
});

/**
 * @function restrartGame
 * @description Restarts game to original state
 * by hiding the game-over related elements, resetting 
 * the score and game enemies and calling the startGame() function
 * to initialize the game objects
 */
function restratGame() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    soundEfx.pause();
    score = 0;
    allEnemies = [];
    startGame(3);
};
 
 /**
 * @function getRandomValue
 * @param {number} min
 * @param {number} max
 * @returns a random value within the given bounds of min and max
 */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @function playBackgroundSound
 * @description it plays the background sound repeatedlly
 * when it is calling by startGame function
 */
function playBackgroundSound() {
    elems = [], index = 0
    for (var i = 0; i < 10; i++) {
        backgroundSound = document.getElementById('audio');
        elems.push(backgroundSound);
        backgroundSound.addEventListener("ended", function () {
           index++; 
           if(backSound){
               (index < elems.length) && (elems[index].play());  
           }else{
                backgroundSound.pause();
                backgroundSound.currentTime = 0;
           }
        }, false);
       if(backSound){
            elems[index].play();
        }else{
            backgroundSound.pause();
            backgroundSound.currentTime = 0;
        }
    }
}

/**
 * @function startGame
 * @param {number} numEnemies
 * @description The function startGame initializes all global objects (<= 3 enemies,
 * 1 player,  initial score = 0) necessary to start the game.
 */
function startGame(enemiesNumber){
    score = 0;
    backSound = true;
    soundEfx = document.getElementById('soundEfx');
    playBackgroundSound();
    for(var i = 0; i < enemiesNumber; i++){
        allEnemies.push(new Enemy());
    }
    player = new Player();
    player.assignScore(score);
    gem = new Gem();
    gem.initialize();
    gemItervId = setInterval(function(){
            gem.hide();
            gem = new Gem();
            gem.initialize();
    }, 10000);
}

//starting the game
startGame(3);





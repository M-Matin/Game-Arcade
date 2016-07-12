var EnemiesArray = [];
var GemsArray = [];

var XandY = {
    X: [0, 100, 200, 300, 400, 500, 600],
    Y: [160, 230, 310, 390],
};

$(document).ready(function() {
    stop = false;
    $('#restart').click(function() {
        $("#playAgain").hide();
        stop = false;
    });
});

var Enemy = function(_y, _v) {
    this.sprite = 'images/enemy-bug.png';
    // this.x = randomInt(-1000, -100);
    this.x = Math.floor(Math.random() * (-100 - 1000 + 1) - 1000);
    this.y = _y;
    this.height = 50;
    this.width = 50;
    this.speed = _v;
};

Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
    if (canvas.width < this.x) {
     //    this.x = randomInt(-2000, -100);
     this.x = Math.floor(Math.random() * (-100 - 1000 + 1) - 1000);
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Enemies = function() {
    this.randomEnemy = [];
};

Enemies.prototype.generate = function(number) {
    for (var i = 0; i < number; i++) {
        var speed = randomInt(50, 500);
        var position = randomInt(0, 3);
        this.randomEnemy[EnemiesArray.length] = new Enemy(XandY.Y[position], speed);
        EnemiesArray.push(this.randomEnemy[EnemiesArray.length]);
    }
};

Enemies.prototype.reset = function() {
    var enemyCount = EnemiesArray.length;
    for (i = 0; i < enemyCount; i++) {
        EnemiesArray.splice(i, EnemiesArray.length);
    }
};


var enemies = new Enemies();


var Gem = function(_X, _Y) {
    var gemArray = ['gem-green.png', 'gem-orange.png', 'gem-blue.png'];
    this.sprite = 'images/' + gemArray[randomInt(0, 2)];
    this.height = 50;
    this.width = 50;
    this.x = _X;
    this.y = _Y;

    // Set the original position of the Gem
    // This does not change throughout one game
    this.ox = _X;
    this.oy = _Y;
};


Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Gem.prototype.clear = function() {
    this.x = -100;
};
Gem.prototype.reset = function() {
    // gem = new Gem();
    this.x = this.ox;
    this.y = this.oy;
};

var gem = new Gem();


var Gems = function() {
    this.gemsArray = [];
};

Gems.prototype.generate = function(int) {
    for (var i = 0; i < int; i++) {
        var x = randomInt(0, 6);
        var y = randomInt(0, 3);
        this.gemsArray[GemsArray.length] = new Gem(XandY.X[x], XandY.Y[y]);
        GemsArray.push(this.gemsArray[GemsArray.length]);
    }
};


Gems.prototype.reset = function() {
    var length = GemsArray.length;
    for (i = 0; i < length; i++) {
        GemsArray.splice(i, GemsArray.length);
    }
};


var gems = new Gems();


var Player = function() {
    this.sprite = 'images/char-pink-girl.png';
    this.x = 300;
    this.y = 470;
    this.height = 50;
    this.width = 50;
    this.lives = 5;
};


Player.prototype.update = function() {
    this.currentX = this.x;
    this.currentY = this.y;
};


Player.prototype.reset = function() {
    this.x = 300;
    this.y = 470;
};

Player.prototype.hit = function() {
    this.x = 300;
    this.y = 470;
};

Player.prototype.updateLives = function(action, value) {
    if (action === "add") {
        this.lives = this.lives + value;
    }
    if (action === "remove") {
        this.lives = this.lives - value;
    }
    stats.updateLives(this.lives);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x !== 0) {
        this.x = this.currentX + -50;
    }
    if (key === 'up' && this.y !== 20) {
        this.y = this.currentY + -50;
    }
    if (key === 'right' && this.x != 600) {
        this.x = this.currentX + 50;
    }
    if (key === 'down' && this.y != 470) {
        this.y = this.currentY + 50;
    }
};


var player = new Player();

var Level = function() {
    this.level = 1;
    enemies.generate(2);
    gems.generate(2);
};

Level.prototype.update = function() {
    this.level++;

    if (this.level % 2) {
        enemies.generate(1);
    }
    gems.reset();
    gems.generate(randomInt(2, 4));
    player.reset();
    stats.updateLevel(this.level);
    stats.updateRecord();
};

Level.prototype.reset = function() {
    this.level = 1;
    player.reset();
    enemies.reset();
    gem.reset();
    stats.reset();
    player.updateLives('add', 2);
    enemies.generate(3);
    stop = true;
    $("#playAgain").show();
};


var level = new Level();


var Stats = function() {
    this.record = 0;
    this.numberOfGems = 0;
};


Stats.prototype.render = function() {};
Stats.prototype.updateLevel = function(level) {
    this.currentLevel = level;
};
Stats.prototype.updateRecord = function() {
    this.record = this.record + 100;
};
Stats.prototype.lives = function() {};
Stats.prototype.updateLives = function(lives) {
    this.currentLives = lives;
};
Stats.prototype.updateGems = function() {
    this.numberOfGems++;
    this.record = this.record + 300;
};

Stats.prototype.reset = function() {
    $("#playAgain #score").html(this.record);
    this.numberOfGems = 0;
    this.record = 0;
};


var stats = new Stats();

document.addEventListener('keydown', function(e) {
    var keysToPlay = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    if (stop === false) {
        player.handleInput(keysToPlay[e.keyCode]);
    }
});


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

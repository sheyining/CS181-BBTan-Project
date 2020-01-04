class BbtanGameBot {
  constructor (ctx,botPositionX) {
    this.ctx = ctx;
    this.sx = BBTAN_GAME_BOT_X;
    this.sy = BBTAN_GAME_BOT_Y;
    this.x = botPositionX;
    this.newX = this.x;
    this.dx = 0;
    this.y = BALL_Y_DEAD - BOT_BG_HEIGHT + BALL_RADIUS + 2;
  }

  drawBbtanBot(gameStatus, game) {
    if (gameStatus == 'inGame' || gameStatus == 'gameOver' || gameStatus == 'nextLevel') {
      this.updateBot();
      this.ctx.beginPath();
      if (game.ballsCounter >= 1 && game.shootStatus === true){
        this.ctx.drawImage(game.spriteSheet, BBTAN_GAME_BOT_ROT_X, BBTAN_GAME_BOT_ROT_Y, BBTAN_GAME_BOT_ROT_WIDTH, BBTAN_GAME_BOT_ROT_HEIGHT, this.x, this.y, BBTAN_BOT_ROT_GAME_WIDTH, BBTAN_BOT_ROT_GAME_HEIGHT);
      }else {
        this.ctx.drawImage(game.spriteSheet, this.sx, this.sy, BBTAN_GAME_BOT_WIDTH, BBTAN_GAME_BOT_HEIGHT, this.x, this.y, BBTAN_BOT_GAME_WIDTH, BBTAN_BOT_GAME_HEIGHT);
      }
      this.ctx.closePath();
    }
  }

  setBotNewX(newX) {
    this.newX = newX;
    this.checkDirectionToMove(newX);
  }

  updateBot() {
    this.x += this.dx;
    if ( (this.x >= (this.newX-BOT_VELOCITY)) && (this.x <= (this.newX+BOT_VELOCITY)) ) {
      this.x = this.newX;
      this.dx = 0;
      this.newX = this.x;
    }
  }

  checkDirectionToMove(newX){
    if (newX < this.x) {
      this.dx = -BOT_VELOCITY;
    }else if (newX > this.x) {
      this.dx = BOT_VELOCITY;
    }else{
      this.dx = 0;
    }
  }
}

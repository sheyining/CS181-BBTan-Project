class BbtanStartBot {
  constructor (ctx) {
    this.ctx = ctx;
    this.x = START_BOT_GAME_X;
    this.dx = START_BOT_VELOCITY;
    this.y = START_BOT_GAME_Y;
  }

  drawBbtanBot(game) {
      this.updateBot();
      this.ctx.beginPath();
      this.ctx.drawImage(game.spriteSheet, START_BOT_X, START_BOT_Y, START_BOT_WIDTH, START_BOT_HEIGHT, this.x, this.y, START_BOT_GAME_WIDTH, START_BOT_GAME_HEIGHT);
      this.ctx.closePath();
  }

  updateBot() {
    this.x += this.dx;
    if (this.x >= (LOGO_GAME_WIDTH)) {
      this.dx = -this.dx;
    }else if(this.x <= START_BOT_GAME_X) {
      this.dx = -this.dx;
    }
  }
}

class Logo {
  constructor(ctx) {
    this.ctx = ctx;
    this.sx = 0;
    this.sy = 0;
  }

  drawLogo(game) {
    this.ctx.beginPath();
    this.ctx.drawImage(game.spriteSheet, this.sx, this.sy, LOGO_WIDTH, LOGO_HEIGHT, LOGO_GAME_X, LOGO_GAME_Y, LOGO_GAME_WIDTH, LOGO_GAME_HEIGHT);
    this.ctx.closePath();
  }
}
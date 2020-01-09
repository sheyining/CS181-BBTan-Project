class StartMenuPlayBtn {
  constructor(ctx) {
    this.ctx = ctx;
  }

  drawBtn(game) {
    this.ctx.beginPath();
    this.ctx.drawImage(game.spriteSheet, PLAY_BTN_X , PLAY_BTN_Y ,PLAY_BTN_WIDTH,PLAY_BTN_HEIGHT, PLAY_BTN_GAME_X,PLAY_BTN_GAME_Y, PLAY_BTN_GAME_WIDTH, PLAY_BTN_GAME_HEIGHT);
    this.ctx.closePath();
  }
}
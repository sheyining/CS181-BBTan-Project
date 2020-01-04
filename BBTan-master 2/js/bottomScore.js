class BotScoreBoard {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = GAME_HEIGHT - BOT_SCORE;
    this.opacityIndex = 1;
    this.bGBotImage = new Image();
  }

  drawBotScoreBoards() {
    this.ctx.beginPath();
    this.ctx.font = "bold 20px Arial";
    this.ctx.strokeStyle = "#d7e163";
    this.ctx.fillStyle = "#d7e163";
    this.bGBotImage.src = "images/bottomScore.png";
    this.ctx.drawImage(
      this.bGBotImage,
      0,
      0,
      this.bGBotImage.width,
      this.bGBotImage.height,
      this.x,
      this.y,
      GAME_WIDTH,
      BOT_SCORE
    );
    //this.ctx.fillText('+1',this.textX+this.x,this.textY+this.y);
    this.ctx.closePath();
  }
}

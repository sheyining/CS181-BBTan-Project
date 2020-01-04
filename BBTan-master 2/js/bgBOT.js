class BbtanBgBot {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = GAME_HEIGHT - BOT_HEIGHT;
    this.opacityIndex = 1;
    this.bGBotImage = new Image();
  }

  drawBbtanBgBot(gameStatus, game) {
    this.changeOpacity(gameStatus);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#d7e163";
    this.ctx.fillStyle = "#d7e163";
    this.ctx.globalAlpha = this.opacityIndex;
    this.bGBotImage.src = "images/bodyBackgroundBot.png";
    this.ctx.drawImage(
      this.bGBotImage,
      0,
      0,
      this.bGBotImage.width,
      this.bGBotImage.height,
      this.x,
      this.y,
      GAME_WIDTH,
      BOT_BG_HEIGHT
    );
    this.ctx.drawImage(
      this.bGBotImage,
      0,
      0,
      this.bGBotImage.width,
      this.bGBotImage.height,
      this.x,
      this.y,
      GAME_WIDTH,
      BOT_BG_HEIGHT
    );
    this.ctx.globalAlpha = 1;
    this.drawCoin(gameStatus, game);
    this.ctx.closePath();
  }

  drawCoin(gameStatus, game) {
    if (gameStatus == "inGame" || gameStatus == "nextLevel") {
      let coinX = TILE_PAD_POWER;
      let coinY = this.y + BOT_BG_HEIGHT / 4 + 2;
      let sx = POWER_UPS_X;
      let sy = POWER_UPS_Y;
      this.ctx.font = "normal 20px SquareFont";
      this.ctx.fillStyle = "white";
      // this.ctx.drawImage(
      //   game.spriteSheet,
      //   sx,
      //   sy,
      //   POWER_UPS_SIZE,
      //   POWER_UPS_SIZE,
      //   coinX,
      //   coinY,
      //   POWER_UPS_WIDTH,
      //   POWER_UPS_HEIGHT
      // );
      this.ctx.fillText(
        game.coin,
        coinX * 2 + POWER_UPS_SIZE,
        this.y + BOT_BG_HEIGHT / 1.6
      );
    }
  }

  changeOpacity(gameStatus) {
    if (
      gameStatus == "inGame" ||
      gameStatus == "gameOver" ||
      gameStatus == "nextLevel"
    ) {
      this.opacityIndex = 0.5;
    } else {
      this.opacityIndex = 1;
    }
  }
}

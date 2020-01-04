class BbtanBgTop {
  constructor(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.opacityIndex = 1;
    this.bGTopImage = new Image();
  }

  drawBbtanBgTop(gameStatus) {
    this.changeOpacity(gameStatus);
    this.ctx.beginPath();
    this.ctx.font = "bold 20px Arial";
    this.ctx.strokeStyle = "#d7e163";
    this.ctx.fillStyle = "#d7e163";
    this.ctx.globalAlpha = this.opacityIndex;
    this.bGTopImage.src = "images/bodyBackgroundTop.png";
    this.ctx.drawImage(
      this.bGTopImage,
      0,
      0,
      this.bGTopImage.width,
      this.bGTopImage.height,
      this.x,
      this.y,
      GAME_WIDTH,
      TOP_HEIGHT
    );
    //this.ctx.fillText('+1',this.textX+this.x,this.textY+this.y);
    this.ctx.globalAlpha = 1;
    this.drawScore(gameStatus, game);
    this.drawTopRightScore(gameStatus, game);
    this.drawTopLeftScore(gameStatus);
    this.ctx.closePath();
  }

  //top middle score-------------------------------------------------------------------------------------------------
  drawScore(gameStatus, game) {
    if (gameStatus == "inGame" || gameStatus == "nextLevel") {
      let scoreX = GAME_WIDTH / 2.1;
      let scoreY = TOP_HEIGHT / 1.44;
      if (game.level > 99) {
        scoreX -= 20;
      }
      this.ctx.beginPath();
      this.ctx.font = "normal 45px SquareFont";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(game.level, scoreX, scoreY);
      this.ctx.closePath();
    }
  }

  //top right score--------------------------------------------------------------------------------------------------
  drawTopRightScore(gameStatus, game) {
    if (gameStatus == "inGame" || gameStatus == "nextLevel") {
      let topX = GAME_WIDTH - 45;
      let topY = 20;
      let scoreX = GAME_WIDTH - 25;
      if (game.level > 9) {
        scoreX = GAME_WIDTH - 30;
      } else if (game.level > 99) {
        scoreX = GAME_WIDTH - 35;
      }
      let scoreY = TOP_HEIGHT - 10;
      this.ctx.beginPath();
      this.ctx.font = "normal 20px SquareFont";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("TOP", topX, topY);
      this.ctx.font = "normal 25px SquareFont";
      this.ctx.fillText(game.level, scoreX, scoreY);
      this.ctx.closePath();
    }
  }

  //top left pause button and help sign------------------------------------------------------------------------------
  drawTopLeftScore(gameStatus) {
    if (gameStatus == "inGame" || gameStatus == "nextLevel") {
      this.ctx.beginPath();
      this.ctx.fillStyle = "white";
      this.ctx.fillRect(PAUSE_X, PAUSE_Y, PAUSE_WIDTH, PAUSE_HEIGHT);
      this.ctx.clearRect(PAUSE_GAP_X, PAUSE_Y, PAUSE_GAP_WIDTH, PAUSE_HEIGHT);
      this.ctx.font = "bold 45px SquareFont";
      this.ctx.fillText("?", QUES_MARK_X, QUES_MARK_Y);
      this.ctx.closePath();
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

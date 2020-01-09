class Ball {
  constructor(ctx,game) {
    this.x = GAME_WIDTH/2;
    this.y = BALL_Y_DEAD;
    this.dummyY = BALL_Y_DEAD;
    this.dummyX = GAME_WIDTH/2;
    this.game = game;
    this.dx = 0;
    this.dy = 0;
    this.ctx = ctx;
    this.visible = true;
    this.flagForSplit = true;
    this.flagForPowHor = true;
    this.ballSound = new BallSound();
    this.flagForPowVer = true;
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'white';
    this.ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  updateBall(game, i){
    if(game.shootStatus) {
      if(this.visible) {
        this.checkCanvasCollision();
        this.limitBoundary(game, i);
        this.checkBallLeft(game);
        this.x += this.dx;
        this.y -= this.dy;
      } else {
        this.dummyX += this.dx;
        this.dummyY -= this.dy;
        this.setVisibility(game);
      }
    }
  }

  //for multiple balls aligning according to the angle-----------------------------------------------------------------
  setOffSetX(j){
    this.dummyX = getX(BALL_Y_DEAD + (j*BALL_GAP));
  }

  //check if the ball is visible in the game---------------------------------------------------------------------------
  setVisibility(game){
    if(this.dummyY < BALL_Y_DEAD){
      this.visible = true;
      this.y = this.dummyY;
      this.x = this.dummyX;
      game.ballsCounter--;
    }
  }

  checkCanvasCollision() {
    if ( (this.x > (GAME_WIDTH-BALL_RADIUS)) || (this.x < (0+BALL_RADIUS)) ){
      this.dx *= -1;
      this.flagForSplit = true;
      this.flagForPowHor = true;
      this.flagForPowVer = true;
    }else if (this.y < (TOP_HEIGHT+(BALL_RADIUS*2))) {
      this.dy *= -1;
      this.flagForSplit = true;
      this.flagForPowHor = true;
      this.flagForPowVer = true;
    }
  }

  limitBoundary(game, i) {
      if (this.x > (GAME_WIDTH - BALL_RADIUS)) {
        this.x = GAME_WIDTH - BALL_RADIUS;
      } else if (this.y > (GAME_HEIGHT - BOT_HEIGHT - BALL_RADIUS)) {
        this.dummyY = BALL_Y_DEAD + (i * BALL_GAP);
        // this.visible = false;
        // game.ballsLeft--;
        // this.dx = 0;
        this.dy = 0;
        if (game.firstDeadBallX == null) {
          game.firstDeadBallX = this.x;
          game.ballsLeftPosX = this.x;
          game.bbtanGameBot.setBotNewX(game.firstDeadBallX);
          this.y = BALL_Y_DEAD;
          this.dx = 0;
          game.ballsLeft--;
          this.visible = false;
        }else {
          this.moveToFirstBall(game);
        }
      } else if (this.x < (0 + BALL_RADIUS)) {
        this.x = BALL_RADIUS;
      } else if (this.y < (TOP_HEIGHT + (BALL_RADIUS*2))) {
        this.y = TOP_HEIGHT + (BALL_RADIUS*2);
      }
  }

  //animate the dead ball to first ball----------------------------------------------------------------------------
  moveToFirstBall(game) {
    if ( (this.x >= game.firstDeadBallX-BALL_RADIUS) && (this.x <= game.firstDeadBallX+BALL_RADIUS) ) {
        this.y = BALL_Y_DEAD;
        this.x = game.firstDeadBallX;
        this.dx = 0;
        game.ballsLeft--;
        this.visible = false;
    }else {
      this.y = BALL_Y_DEAD + 3;
      if (this.x < game.firstDeadBallX) {
        this.dx = BALL_VELOCITY;
      } else {
        this.dx = -1 * BALL_VELOCITY;
      }
    }
  }

  //if no balls left to shoot go to next level---------------------------------------------------------------------
  checkBallLeft(game){
    if(game.ballsLeft==0) {
      game.firstDeadBallX = null;
      game.level++;
      game.setColorChangeIndex();
      game.removePowerUps();
      game.updateTileMap();
      game.flagPowerUps = [];
      game.shootStatus = false;
    }
  }

  collisionOperation(obstacle,game){
    switch (obstacle[1]){
      case SQUARE:
        this.flagForSplit = true;
        this.flagForPowHor = true;
        this.flagForPowVer = true;
        this.changeDirectionSquare(obstacle[0]);
        break;
      case POWER_SPLIT:
        if(this.flagForSplit){
          this.changeDirectionPowerSplit();
        }
        this.flagForSplit = false;
        this.flagForPowHor = true;
        this.flagForPowVer = true;
        break;
      case POWER_HORZ:
        if(this.flagForPowHor){
          this.laserHorizontal(obstacle[0],game);
        }
        this.flagForSplit = true;
        this.flagForPowHor = false;
        this.flagForPowVer = true;
        break;
      case POWER_VERT:
        if(this.flagForPowVer){
          this.laserVertical(obstacle[0],game);
        }
        this.flagForSplit = true;
        this.flagForPowHor = true;
        this.flagForPowVer = false;
        break;
      case DOUBLE_SQUARE:
        this.flagForSplit = true;
        this.flagForPowHor = true;
        this.flagForPowVer = true;
        this.changeDirectionSquare(obstacle[0]);
        break;
      default:
      //do  nothing
    }
  }

  changeDirectionSquare(obstacle){
    if (this.x - BALL_RADIUS/2 < obstacle.x) {
      this.dx = -Math.abs(this.dx);
    } else if (this.x + BALL_RADIUS/2 > (obstacle.x + OBSTACLE_WIDTH)) {
      this.dx = Math.abs(this.dx);
    }

    if (this.y - BALL_RADIUS/2 < obstacle.y) {
      this.dy = Math.abs(this.dy);
    } else if (this.y + BALL_RADIUS/2 > (obstacle.y + OBSTACLE_HEIGHT)) {
      this.dy = -Math.abs(this.dy);
    }
    this.ballSound.play('collision');
  }

  changeDirectionPowerSplit() {
    let angle = getRandomFloat(Math.PI/2,0);
    let dx = Math.cos(angle) * BALL_VELOCITY;
    let dy = Math.sin(angle) * BALL_VELOCITY;
    this.dx = dx;
    let random = getRandomNumber(4,3);
    this.ballSound.play('powerUpSplit');
    //for negative dx random value;
    if(random == 3){
      this.dx *= -1;
    }
    this.dy = dy;
  }

  laserHorizontal(obstacle,game) {
    let row = obstacle.row;
    game.horizontalLaser(row,this);
    for(let i=0;i<TILE_COLUMNS;i++){
      game.levelMap[row][i]--;
      if(game.levelMap[row][i] <= 0){
        game.levelMap[row][i] = 0;
        let tempValue = game.tileMap[row][i];
        if (tempValue<=5 && tempValue>=1) {
          game.tileMap[row][i] = 0;
          game.animation.push(new Animation(game,row,i));
        }
      }
    }
  }

  laserVertical(obstacle,game) {
    let column = obstacle.column;
    game.verticalLaser(column,this);
    for(let i=1;i<TILE_ROWS;i++){
      game.levelMap[i][column]--;
      if(game.levelMap[i][column] <= 0){
        game.levelMap[i][column] = 0;
        let tempValue = game.tileMap[i][column];
        if (tempValue<=5 && tempValue>=1) {
          game.tileMap[i][column] = 0;
          game.animation.push(new Animation(game,i,column));
        }
      }
    }
  }
}

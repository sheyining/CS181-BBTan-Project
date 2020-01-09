class PowerUps {
  constructor(ctx,row,column,spriteSheet,type) {
    this.x = (TILE_WIDTH * column) + TILE_PAD_POWER;
    this.y = (TILE_HEIGHT * row) + TILE_PAD_POWER + TOP_HEIGHT;
    this.type = type;
    this.row = row;
    this.column = column;
    this.sx = POWER_UPS_X + (POWER_UPS_SIZE * this.type);
    this.sy = POWER_UPS_Y;
    this.ctx = ctx;
    this.spriteSheet = spriteSheet;
  }

  drawCoin() {
    this.ctx.drawImage(this.spriteSheet,this.sx,this.sy,POWER_UPS_SIZE,POWER_UPS_SIZE,this.x,this.y,POWER_UPS_WIDTH,POWER_UPS_HEIGHT);
  }

  drawPlus() {
    this.ctx.drawImage(this.spriteSheet,this.sx,this.sy,POWER_UPS_SIZE,POWER_UPS_SIZE,this.x,this.y,POWER_UPS_WIDTH,POWER_UPS_HEIGHT);
  }

  drawPowerHorizontal() {
    this.ctx.drawImage(this.spriteSheet,this.sx,this.sy,POWER_UPS_SIZE,POWER_UPS_SIZE,this.x,this.y,POWER_UPS_WIDTH,POWER_UPS_HEIGHT);
  }

  drawPowerVertical() {
    this.ctx.drawImage(this.spriteSheet,this.sx,this.sy,POWER_UPS_SIZE,POWER_UPS_SIZE,this.x,this.y,POWER_UPS_WIDTH,POWER_UPS_HEIGHT);
  }

  drawPowerSplit() {
    this.ctx.drawImage(this.spriteSheet,this.sx,this.sy,POWER_UPS_SIZE,POWER_UPS_SIZE,this.x,this.y,POWER_UPS_WIDTH,POWER_UPS_HEIGHT);
  }

  checkCollision(ball) {
    let powerUpCenterX = this.x + POWER_UPS_WIDTH/2;
    let powerUpCenterY = this.y + POWER_UPS_HEIGHT/2;
    let radiusPowerUP = POWER_UPS_WIDTH/2; //both width n height are same
    let distanceX = ball.x - powerUpCenterX; //x2 - x1
    let distanceY = ball.y - powerUpCenterY; //y2 - y1
    let distanceBetweenCenter = Math.sqrt( Math.pow(distanceX,2) + Math.pow(distanceY,2) );
    if ( distanceBetweenCenter <= (radiusPowerUP+BALL_RADIUS) ) {
      return true;
    }
    return false;
  }
}
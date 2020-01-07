class StartMenuBall {
  constructor(ctx) {
    this.x = GAME_WIDTH / 2;
    this.y = PLAY_BTN_GAME_Y - BALL_RADIUS - BOUNCE_HEIGHT;
    this.dy = 0;
    this.ctx = ctx;
  }

  updateBall(){
    this.y += this.dy;
    this.dy *= .99;
    this.dy += .50;
    if (this.y + this.dy > PLAY_BTN_GAME_Y - BALL_RADIUS ||
      this.y + this.dy < PLAY_BTN_GAME_Y - BALL_RADIUS - BOUNCE_HEIGHT) {
      this.dy = -this.dy;
    }
  }

  drawBall(){
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'white';
    this.ctx.fillStyle = 'white';
    this.ctx.arc(this.x, this.y, BALL_RADIUS, 0, Math.PI * 2, true);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
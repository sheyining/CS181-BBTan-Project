class Plus1 {
  constructor(ctx,row,column) {
    this.x = (TILE_WIDTH * column) + TILE_PADDING;
    this.y = (TILE_WIDTH * row) + TILE_PADDING + TOP_HEIGHT;
    this.counter = 0;
    this.row = row;
    this.opacityIndex = 1;
    this.column = column;
    this.textX = OBSTACLE_WIDTH/3;
    this.textY = OBSTACLE_HEIGHT/2 + (TILE_PADDING*4);
    this.ctx = ctx;
  }

  drawPlus1() {
    this.ctx.beginPath();
    this.ctx.font = 'bold 20px Arial'
    this.ctx.strokeStyle = '#d7e163';
    this.ctx.fillStyle = '#d7e163';
    this.ctx.clearRect(this.x,this.y,OBSTACLE_WIDTH,OBSTACLE_HEIGHT);
    this.ctx.fillText('+1',this.textX+this.x,this.textY+this.y);
    this.ctx.closePath();
  }

  updatePlus1() {
    this.counter++;
    this.opacityIndex -= .016;
    this.textY -= .5;
    this.ctx.beginPath();
    this.ctx.font = 'bold 20px Arial'
    this.ctx.strokeStyle = '#d7e163';
    this.ctx.fillStyle = '#d7e163';
    this.ctx.clearRect(this.x,this.y,OBSTACLE_WIDTH,OBSTACLE_HEIGHT);
    this.ctx.globalAlpha = this.opacityIndex;
    this.ctx.fillText('+1',this.textX+this.x,this.textY+this.y);
    this.ctx.globalAlpha = 1;
    this.ctx.closePath();
  }
}
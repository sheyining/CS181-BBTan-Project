class ObsTriangleTopLeft {
  constructor(ctx,row,column) {
    this.x = (TILE_WIDTH * column) + TILE_PADDING;
    this.y = (TILE_HEIGHT * row) + TILE_PADDING;
    this.ctx = ctx;
    this.level;
    this.textX = 4;//aligning font at center
    this.textY = 15;//aligning font at center
    this.ctx.strokeStyle = 'yellow';
    this.ctx.fillStyle = 'yellow';
    this.ctx.lineWidth = LINE_WIDTH;
  }


  drawTriangleTopLeft(level) {
    this.level = level;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x,this.y);
    this.ctx.lineTo(this.x + OBSTACLE_WIDTH,this.y);
    this.ctx.lineTo(this.x,this.y + OBSTACLE_HEIGHT);
    this.ctx.fillText(this.level,this.textX+this.x,this.textY+this.y);
    this.ctx.closePath();
    this.ctx.stroke();
  }
}
class AnimationSquare {
  constructor(row, column, game, dx, dy) {
    this.x = (TILE_WIDTH * column) + TILE_PADDING + OBSTACLE_WIDTH/2;
    this.y = (TILE_HEIGHT * row) + TILE_PADDING + TOP_HEIGHT + OBSTACLE_HEIGHT/2;
    this.dx = dx;
    this.dy = dy;
    this.game = game;
    this.width = getRandomNumber(MAX_SQUARE_WIDTH, MIN_SQUARE_WIDTH);
    this.height = getRandomNumber(MAX_SQUARE_HEIGHT, MIN_SQUARE_HEIGHT);
    this.row = row;
    this.sqColor = 'rgb(' + randomColor() + ',' + randomColor() + ', ' + randomColor() + ')';
    this.column = column;
    this.ctx = game.ctx;
  }

  drawSquare(opacityIndex) {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.sqColor;
    this.ctx.globalAlpha = opacityIndex;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.globalAlpha = 1;
    this.ctx.closePath();
    this.updateSquare();
  }

  updateSquare(){
    this.x += this.dx;
    this.y += this.dy;
  }
}


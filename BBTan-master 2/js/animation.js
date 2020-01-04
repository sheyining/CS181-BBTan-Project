class Animation {
  constructor(game, row, column) {
    this.game = game;
    this.row = row;
    this.column = column;
    this.ctx = game.ctx;
    this.opacityIndex = 1;
    this.squares = [];
    this.createSquares();
    this.flag = 0;
  }

  createSquares(){
    let changeSignAt = NUMBER_OF_SQUARES/4;
    this.dx = 0;
    this.dy = 0;
    let angleIndex = 0;
    for(let i=0;i<NUMBER_OF_SQUARES;i++){
      let animateVel = getRandomFloat(ANIMATE_VELOCITY_MAX,ANIMATE_VELOCITY_MIN)
      this.dx = Math.cos(angleForAnimation[angleIndex]) * animateVel;
      this.dy = Math.sin(angleForAnimation[angleIndex]) * animateVel;
      if(i<changeSignAt && i>=0){
        this.squares.push(new AnimationSquare(this.row,this.column,this.game,-this.dx,this.dy));
      }else if(i<(changeSignAt*2) && i>=changeSignAt){
        this.squares.push(new AnimationSquare(this.row,this.column,this.game,this.dx,this.dy));
      }else if(i<(changeSignAt*3) && i>=(changeSignAt*2)){
        this.squares.push(new AnimationSquare(this.row,this.column,this.game,this.dx,-this.dy));
      }else{
        this.squares.push(new AnimationSquare(this.row,this.column,this.game,-this.dx,-this.dy));
      }
      angleIndex++;
      if(angleIndex>angleForAnimation.length-1){
        angleIndex=0;
      }
    }
  }

  draw(){
    for(let i=0;i<NUMBER_OF_SQUARES;i++){
      this.squares[i].drawSquare(this.opacityIndex);
    }
    this.opacityIndex -= OPACITY_VELOCITY;
  }
}


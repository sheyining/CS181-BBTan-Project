class Game {
  constructor() {
    this.canvas = document.getElementById('mainCanvas');
    this.canvas.width = GAME_WIDTH;
    this.highScore = this.setHighScore();
    this.canvas.height = GAME_HEIGHT;
    this.gameSound = new GameSound();
    this.ctx = this.canvas.getContext('2d');
    this.bgTop = new BbtanBgTop(this.ctx);
    this.bgBot = new BbtanBgBot(this.ctx);
    this.botScoreBoard = new BotScoreBoard(this.ctx);
    this.level = 1;
    this.colorChange = 0;
    //Setting the time for game----------------------------------------------------------------------------------------
    this.gameTime = TOTAL_TIME;
    this.gameTimeSec = '00';
    this.gameTimeMin = '30';
    this.timerCounter = 0;
    this.dottedLine = [];
    this.timerColor = TIMER_COLOR[getRandomNumber(TIMER_COLOR.length - 1 , 0)];
    this.startMenuTextX = 10;
    this.gameStatus = 'startMenu';
    this.coin = 0;
    this.addBalls = 0; //number of balls to add on next level
    this.totalBalls = 1;
    this.shootStatus = false;
    this.ballsLeft = this.totalBalls; //number of balls moving i.e. not dead
    this.ballsCounter = 0;
    this.firstDeadBallX = null;
    this.flagPowerUps = [];
    this.plus1Score = []; //for storing +1 symbol objects
    this.spriteSheet = new Image();
    this.spriteSheet.src = 'images/sprite-sheet.png';
    this.ballsArray = [];
    this.ballsArray.push(new Ball(this.ctx,this));
    this.bbtanGameBot = new BbtanGameBot(this.ctx,this.ballsArray[0].x);
    this.ballsLeftPosX = this.ballsArray[0].x;
    this.obstacles = [];
    this.animation = [];
    this.nextLevelCounter = 1;
    //start menu objects --------------------------------------------------------------------------------------------
    this.startMenuBall = new StartMenuBall(this.ctx);
    this.startMenuBot = new BbtanStartBot(this.ctx);
    this.tileMap = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ];
    this.levelMap = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ];
  }

  setHighScore() {
    if(getHighScore() === null){
      return 0;
    }else {
      return getHighScore();
    }
  }

  //checkLevel for Blue square---------------------------------------------------------------------------------------
  checkLevel(){
    if(this.level % 10 === 0){
      let quotient = this.level/10;
      if(quotient % 2 === 1){
        return false;
      }
    }
    return true;
  }

  //tile-row generator logic------------------------------------------------------------------------------------------
  generateNewTile() {
    let addBallPosition = getRandomNumber(TILE_COLUMNS-1,0); //position for the +1 ball powerUP
    let newTile = [];
    let newLevel = [];
    let randomValue;
    for (let i=0;i<TILE_COLUMNS;i++) {
      if( addBallPosition === i){
        newTile.push(PLUS_BALL);
        newLevel.push(this.level);
      } else {
        if(this.checkLevel()) {
          randomValue = getRandomNumber(8, 0);
          if (randomValue >= 0 && randomValue <= 5) {
            newTile.push(SQUARE);
            newLevel.push(this.level);
          } else if (randomValue === 6) {
            this.randomTriangle(newTile, newLevel);
          } else if (randomValue === 7) {
            this.randomPowerUp(newTile, newLevel);
          } else {
            newTile.push(BLANK);
            newLevel.push(this.level);
          }
        }else{
          randomValue = getRandomNumber(8, 0);
          if (randomValue >= 0 && randomValue <= 3) {
            newTile.push(DOUBLE_SQUARE);
            newLevel.push(this.level*2);
          } else {
            newTile.push(BLANK);
            newLevel.push(this.level);
          }
        }
      }
    }
    return [newTile,newLevel];
  }

  //random triangle selector-------------------------------------------------------------------------------------------
  randomTriangle(newTile,newLevel) {
    let randomValue1 = getRandomNumber(3,0);
    switch (randomValue1) {
      case 0:
        newTile.push(TRIANGLE_BOT_LEFT);
        newLevel.push(this.level);
        break;
      case 1:
        newTile.push(TRIANGLE_BOT_RIGHT);
        newLevel.push(this.level);
        break;
      case 2:
        newTile.push(TRIANGLE_TOP_LEFT);
        newLevel.push(this.level);
        break;
      default:
        newTile.push(TRIANGLE_TOP_RIGHT);
        newLevel.push(this.level);
    }
  }

  //randomPowerUP selector--------------------------------------------------------------------------------------------
  randomPowerUp(newTile,newLevel) {
    let randomValue2 = getRandomNumber(3,0);
    switch (randomValue2) {
      case 0:
        newTile.push(COIN);
        newLevel.push(this.level);
        break;
      case 1:
        newTile.push(POWER_HORZ);
        newLevel.push(this.level);
        break;
      case 2:
        newTile.push(POWER_VERT);
        newLevel.push(this.level);
        break;
      default:
        newTile.push(POWER_SPLIT);
        newLevel.push(this.level);
    }
  }

  //updating TILE MAP and number of balls-------------------------------------------------------------------------
  updateTileMap() {
    let lastBall = this.ballsArray.length - 1;
    for(let i=0;i<this.addBalls;i++){
      let tempBall = new Ball(this.ctx,this);
      tempBall.x = this.ballsArray[0].x;
      tempBall.dummyX = this.ballsArray[0].x;
      tempBall.dummyY = BALL_Y_DEAD  + (lastBall + i + 1)* BALL_GAP;
      tempBall.visible = false;
      this.ballsArray.push(tempBall);
    }
    this.totalBalls += this.addBalls;
    this.addBalls = 0;
    this.ballsLeft = this.totalBalls;
    //update tile map
    let tempValue ;
    tempValue = this.generateNewTile();
    this.ballsCounter = this.totalBalls;
    this.tileMap[0] = tempValue[0];
    this.levelMap[0] = tempValue[1];
    this.gameStatus = 'nextLevel';
  }

  //animation for next level sliding downwards ----------------------------------------------------------------------
  animateToNextLevel(obstacle,powerUp){
    let animateIndex = NEXT_LEVEL_SLIDE_SPEED * this.nextLevelCounter;
    for (let i = 0; i < game.tileMap.length; i++) {
      let row = game.tileMap[i];
      for (let j = 0; j < TILE_WIDTH; j++) {
        let index = row[j];
        switch (index) {
          case SQUARE:
            obstacle = new ObsSquare(game.ctx, i + animateIndex, j,game);
            obstacle.drawSquare(game.levelMap[i][j]);
            game.obstacles.push([obstacle, SQUARE]);
            break;
          // case TRIANGLE_BOT_LEFT:
          //   obstacle = new ObsTriangleBotLeft(game.ctx,i,j);
          //   obstacle.drawTriangleBotLeft(game.levelMap[i][j]);
          //   break;
          // case TRIANGLE_BOT_RIGHT:
          //   obstacle = new ObsTriangleBotRight(game.ctx,i,j);
          //   obstacle.drawTriangleBotRight(game.levelMap[i][j]);
          //   break;
          // case TRIANGLE_TOP_LEFT:
          //   obstacle = new ObsTriangleTopRight(game.ctx,i,j);
          //   obstacle.drawTriangleTopRight(game.levelMap[i][j]);
          //   break;
          // case TRIANGLE_TOP_RIGHT:
          //   obstacle = new ObsTriangleTopLeft(game.ctx,i,j);
          //   obstacle.drawTriangleTopLeft(game.levelMap[i][j]);
          //   break;
          case COIN:
            powerUp = new PowerUps(game.ctx,i + animateIndex, j, game.spriteSheet, 0); //type 0 for coin
            powerUp.drawCoin();
            game.obstacles.push([powerUp, COIN]);
            break;
          case PLUS_BALL:
            powerUp = new PowerUps(game.ctx,i + animateIndex, j, game.spriteSheet, 1); //type 1 for plus
            powerUp.drawPlus();
            game.obstacles.push([powerUp, PLUS_BALL]);
            break;
          case POWER_HORZ:
            powerUp = new PowerUps(game.ctx, i + animateIndex, j, game.spriteSheet, 2); //type 2 for power horizontal
            powerUp.drawPowerHorizontal();
            game.obstacles.push([powerUp, POWER_HORZ]);
            game.flagPowerUps.push([i, j, false]);
            break;
          case POWER_SPLIT:
            powerUp = new PowerUps(game.ctx,i + animateIndex, j, game.spriteSheet, 3); //type 4 for power split
            powerUp.drawPowerSplit();
            game.obstacles.push([powerUp, POWER_SPLIT]);
            game.flagPowerUps.push([i, j, false]);
            break;
          case POWER_VERT:
            powerUp = new PowerUps(game.ctx, i + animateIndex, j, game.spriteSheet, 4); //type 3 for power vertical
            powerUp.drawPowerVertical();
            game.obstacles.push([powerUp, POWER_VERT]);
            game.flagPowerUps.push([i, j, false]);
            break;
          case DOUBLE_SQUARE:
            obstacle = new ObsSquareDouble(game.ctx, i + animateIndex, j,game);
            obstacle.drawSquare(game.levelMap[i][j]);
            game.obstacles.push([obstacle, DOUBLE_SQUARE]);
            break;
          default:
          //do nothing
        }
      }
    }
    this.nextLevelCounter++;
    if(animateIndex >= 1){
      let tempTileMap = this.tileMap.slice();
      let tempLevelMap = this.levelMap.slice();
      this.nextLevelCounter = 1;
      this.gameStatus = 'inGame';
      //update tile map
      this.ballsCounter = this.totalBalls;
      for(let i=1;i<tempTileMap.length;i++){
        this.tileMap[i] = tempTileMap[i-1];
        this.levelMap[i] = tempLevelMap[i-1];
      }
      this.tileMap[0] = [0,0,0,0,0,0,0];
      this.levelMap[0] = [0,0,0,0,0,0,0];
      this.gameStatus = 'inGame';
      this.checkTileMap();
    }
  }

  //check tileMap for gameover---------------------------------------------------------------------------------------
  checkTileMap(){
    let lastRow = this.tileMap.length - 1;
    for(let i=0; i<TILE_COLUMNS; i++){
      if(this.tileMap[lastRow][i] === SQUARE || this.tileMap[lastRow][i] === DOUBLE_SQUARE){
        this.gameStatus = 'gameOver';
        this.gameSound.play('gameOver');
        this.checkHighScore();
        break;
      }
    }
  }

  //check HIGHSCORE--------------------------------------------------------------------------------------------------
  checkHighScore() {
    if(this.highScore < this.level){
      storeHighScore(this.level);
      this.highScore = this.level;
    }
  }

  //checking collision for all the obstacles according to their types------------------------------------------------
  checkCollision(ball) {
    if(this.gameStatus === 'inGame') {
      for (let i = 0; i < this.obstacles.length; i++) {
        if (this.obstacles[i][0].checkCollision(ball)) {
          this.updateFlagArray(this.obstacles[i][0].row, this.obstacles[i][0].column);
          ball.collisionOperation(this.obstacles[i], this);
          this.updateMaps(this.obstacles[i][0].row, this.obstacles[i][0].column, this.obstacles[i][1],ball);
        }
      }
    }
  }

  //updating both maps after collision-------------------------------------------------------------------------------
  updateMaps(row,column,type,ball){
    let newPlus1Score;
    switch (type)
    {
      case SQUARE:
        this.levelMap[row][column]--;
        if (this.levelMap[row][column] <= 0) {
          this.tileMap[row][column] = 0;
          this.animation.push(new Animation(this,row,column));
        }
        break;
      case COIN:
        this.coin++;
        this.tileMap[row][column] = 11;
        newPlus1Score = new Plus1(this.ctx,row,column);
        newPlus1Score.drawPlus1();
        ball.ballSound.play('coin');
        this.plus1Score.push(newPlus1Score);
        break;
      case PLUS_BALL:
        this.addBalls++;
        this.tileMap[row][column] = 11;
        newPlus1Score = new Plus1(this.ctx,row,column);
        newPlus1Score.drawPlus1();
        ball.ballSound.play('addBall');
        this.plus1Score.push(newPlus1Score);
        break;
      case DOUBLE_SQUARE:
        this.levelMap[row][column]--;
        if (this.levelMap[row][column] <= 0) {
          this.tileMap[row][column] = 0;
          this.animation.push(new Animation(this,row,column));
        }
        break;
      default:
      //do nothing
    }
  }

  //update startGameflag array if collision----------------------------------------------------------------------------------
  updateFlagArray(row,column) {
    for(let i=0;i<this.flagPowerUps.length;i++){
      if(this.flagPowerUps[i][0] === row && this.flagPowerUps[i][1] === column){
        this.flagPowerUps[i][2] = true;
        break;
      }
    }
  }

  //removing powerups if the ball is dead---------------------------------------------------------------------------
  removePowerUps(){
    this.flagPowerUps.forEach((value)=>{
      if(value[2] === true){
        this.tileMap[value[0]][value[1]] = 0 ;
      }
    });
  }

  //animation for horizontal laser----------------------------------------------------------------------------------
  horizontalLaser(row,ball) {
    let valueY = (TILE_HEIGHT * row) + OBSTACLE_HEIGHT/2 - TILE_PADDING + TOP_HEIGHT;
    this.ctx.beginPath();
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillRect(0,valueY,GAME_WIDTH,TILE_HEIGHT/3);
    ball.ballSound.play('powerUpLaser');
    this.ctx.closePath();
  }

  //animation for vertical laser-------------------------------------------------------------------------------------
  verticalLaser(column,ball) {
    let valueX = (TILE_WIDTH * column) + OBSTACLE_WIDTH/2 - TILE_PADDING;
    this.ctx.beginPath();
    this.ctx.fillStyle = 'yellow';
    this.ctx.fillRect(valueX,TOP_HEIGHT,TILE_WIDTH/3,GAME_HEIGHT - TOP_HEIGHT - BOT_HEIGHT);
    ball.ballSound.play('powerUpLaser');
    this.ctx.closePath();
  }

  //check if all the balls are dead or not--------------------------------------------------------------------------
  checkDeadBall(){
    for(let i=0;i<this.ballsArray.length;i++){
      if(this.ballsArray[i].dx != 0 || this.ballsArray[i].dy !=0){
        return false;
      }
    }
    return true;
  }

  //update +1 symbol after eating ADDBALL POWERUP or COIN-----------------------------------------------------------
  updatePlusOneSymbol() {
    let tempPlus1Score = this.plus1Score.slice();
    for(let i=0;i<tempPlus1Score.length;i++){
      if(tempPlus1Score[i].counter>=30){
        this.plus1Score.splice(this.plus1Score.indexOf(this.plus1Score[i]),1);
      }
    }
    for(let i=0;i<this.plus1Score.length;i++){
      let row = this.plus1Score[i].row;
      let column = this.plus1Score[i].column;
      this.plus1Score[i].updatePlus1();
      if(this.plus1Score[i].counter>=30){
        this.tileMap[row][column] = 0;
      }
    }
  }

  //timer counter for 60 FPS into 1 sec------------------------------------------------------------------------------
  timer(){
    if(this.gameStatus === 'inGame' || this.gameStatus === 'nextLevel') {
      this.timerCounter++;
      if (this.timerCounter >= 60) {
        this.timerCounter = 0;
        // this.timerColor = TIMER_COLOR[getRandomNumber(TIMER_COLOR.length - 1 , 0)];
        setTime(this);
      }
    }
  }

  //display time at bottom--------------------------------------------------------------------------------------------
  drawTime() {
    if(this.gameStatus === 'inGame' || this.gameStatus === 'gameOver' || this.gameStatus === 'nextLevel') {
      let color = getRandomNumber(TIMER_COLOR.length-1,0);
      this.ctx.beginPath();
      // this.ctx.font = 'normal 45px SquareFont';
      // this.ctx.fillStyle = game.timerColor;
      // // this.ctx.fillText(this.gameTimeMin + ":" + this.gameTimeSec,TIMERX,TIMERY);
      this.ctx.closePath();
    }
  }

  //display number of balls left--------------------------------------------------------------------------------------
  drawBallsLeft() {
    if((this.gameStatus === 'inGame' || this.gameStatus ==='nextLevel') && this.ballsCounter > 1) {
      this.ctx.beginPath();
      this.ctx.font = 'normal 15px SquareFont';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('x'+this.ballsCounter,this.ballsLeftPosX,BALL_Y_DEAD - (BALL_RADIUS*2));
      this.ctx.closePath();
    }
  }

  drawPauseMenu() {
    if(this.gameStatus === 'paused') {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#5d5756';
      this.ctx.strokeStyle = 'white';
      this.ctx.globalAlpha = .8;
      this.ctx.fillRect(PAUSE_MENU_X,PAUSE_MENU_Y,PAUSE_MENU_WIDTH,PAUSE_MENU_HEIGHT);
      this.ctx.strokeRect(PAUSE_MENU_X,PAUSE_MENU_Y,PAUSE_MENU_WIDTH,PAUSE_MENU_HEIGHT);
      this.drawResume();
      this.drawRestart();
      this.drawMainMenu();
      this.ctx.globalAlpha = 1;
      this.ctx.closePath();
    }
  }

  drawResume() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#f6d917';
    this.ctx.strokeStyle = 'white';
    this.ctx.globalAlpha = .8;
    this.ctx.fillRect(RESUME_X,RESUME_Y,RESUME_WIDTH,RESUME_HEIGHT);
    this.ctx.strokeRect(RESUME_X,RESUME_Y,RESUME_WIDTH,RESUME_HEIGHT);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'normal 25px SquareFont'
    this.ctx.fillText('RESUME',RESUME_TEXT_X,RESUME_TEXT_Y);
    this.ctx.closePath();
  }

  drawRestart() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#c0289a';
    this.ctx.strokeStyle = 'white';
    this.ctx.globalAlpha = .8;
    this.ctx.fillRect(RESTART_X,RESTART_Y,RESTART_WIDTH,RESTART_HEIGHT);
    this.ctx.strokeRect(RESTART_X,RESTART_Y,RESTART_WIDTH,RESTART_HEIGHT);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'normal 25px SquareFont'
    this.ctx.fillText('RESTART',RESTART_TEXT_X,RESTART_TEXT_Y);
    this.ctx.closePath();
  }

  drawMainMenu() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#00c2ce';
    this.ctx.strokeStyle = 'white';
    this.ctx.globalAlpha = .8;
    this.ctx.fillRect(MAIN_MENU_X,MAIN_MENU_Y,MAIN_MENU_WIDTH,MAIN_MENU_HEIGHT);
    this.ctx.strokeRect(MAIN_MENU_X,MAIN_MENU_Y,MAIN_MENU_WIDTH,MAIN_MENU_HEIGHT);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'normal 25px SquareFont'
    this.ctx.fillText('MAIN MENU',MAIN_MENU_TEXT_X,MAIN_MENU_TEXT_Y);
    this.ctx.closePath();
  }

  //startMenu for game -----------------------------------------------------------------------------------------------
  drawStartMenu() {
    if(this.gameStatus === 'startMenu') {
      this.ctx.beginPath();
      this.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
      this.ctx.fillStyle = 'black';
      this.ctx.strokeStyle = 'white';
      this.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
      this.bgTop.drawBbtanBgTop(game.gameStatus);
      let logo = new Logo(this.ctx);
      logo.drawLogo(this);
      this.startMenuBall.drawBall();
      this.startMenuBall.updateBall();
      this.startMenuBot.drawBbtanBot(this);
      let playBtn = new StartMenuPlayBtn(this.ctx);
      playBtn.drawBtn(this);
      this.bgBot.drawBbtanBgBot(game.gameStatus, game);
      this.botScoreBoard.drawBotScoreBoards(game.level);
      this.drawStartMenuText();
      this.ctx.closePath();
    }
  }

  //What happens after 30M text at bottom in start menu --------------------------------------------------------------
  drawStartMenuText(){
    this.updateStartMenuText();
    this.ctx.beginPath();
    this.ctx.font = 'normal 45px SquareFont';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(START_TEXT,this.startMenuTextX,TIMERY);
    this.ctx.closePath();
  }

  updateStartMenuText() {
    this.startMenuTextX -= START_MENU_TEXT_VELOCITY;
    if(this.startMenuTextX < -START_TEXT_LENGTH){
      this.startMenuTextX = GAME_WIDTH - 10;
    }
  }

  drawGameOver() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#12374d'; //for background gameover menu
    this.ctx.strokeStyle = 'white';
    this.ctx.globalAlpha = .98;
    this.ctx.fillRect(GAMEOVER_BG_X, GAMEOVER_BG_Y, GAMEOVER_BG_WIDTH, GAMEOVER_BG_HEIGHT);
    this.ctx.fillRect(GAMEOVER_BG_BOT_X, GAMEOVER_BG_BOT_Y, GAMEOVER_BG_BOT_WIDTH, GAMEOVER_BG_BOT_HEIGHT);
    this.ctx.fillStyle = '#90bad3'; //for text
    this.ctx.font = 'normal 40px SquareFont';
    this.ctx.fillText('SCORE :',GAMEOVER_SCORE_X,GAMEOVER_SCORE_Y);
    this.ctx.font = 'normal 20px SquareFont';
    this.ctx.fillText('BEST SCORE :',GAMEOVER_BEST_SCORE_X,GAMEOVER_BEST_SCORE_Y);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'normal 60px SquareFont';
    this.ctx.fillText(this.level,GAMEOVER_SCORE_NUM_X,GAMEOVER_SCORE_NUM_Y);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'normal 40px SquareFont';
    this.ctx.fillText(this.highScore,GAMEOVER_BEST_SCORE_NUM_X,GAMEOVER_BEST_SCORE_NUM_Y);
    this.drawGameOverCoin();
    this.ctx.globalAlpha = 1;
    this.drawGameOverMenu();
  }

  drawGameOverCoin(){
    let coinX = GAMEOVER_COIN_X;
    let coinY = GAMEOVER_COIN_Y;
    let sx = POWER_UPS_X;
    let sy = POWER_UPS_Y;
    this.ctx.font = 'normal 50px SquareFont';
    this.ctx.fillStyle = 'white';
    this.ctx.drawImage(this.spriteSheet,sx,sy,POWER_UPS_SIZE,POWER_UPS_SIZE,coinX,coinY,GAMEOVER_COIN_WIDTH,GAMEOVER_COIN_HEIGHT);
    this.ctx.fillText(this.coin,GAMEOVER_COIN_TEXT_X,GAMEOVER_COIN_TEXT_Y);
  }

  drawGameOverMenu(){
    //PLAY AGAIN BUTTON
    this.ctx.beginPath();
    this.ctx.fillStyle = '#c4ab00';
    this.ctx.strokeStyle = 'white';
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(PLAY_AGAIN_X,PLAY_AGAIN_Y,PLAY_AGAIN_WIDTH,PLAY_AGAIN_HEIGHT);
    this.ctx.strokeRect(PLAY_AGAIN_X,PLAY_AGAIN_Y,PLAY_AGAIN_WIDTH,PLAY_AGAIN_HEIGHT);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'normal 25px SquareFont'
    this.ctx.fillText('PLAY AGAIN',PLAY_AGAIN_TEXT_X,PLAY_AGAIN_TEXT_Y);
    this.ctx.closePath();
    //MAIN MENU BUTTON
    this.ctx.beginPath();
    this.ctx.fillStyle = '#00929e';
    this.ctx.strokeStyle = 'white';
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(GO_MAIN_MENU_X,GO_MAIN_MENU_Y,GO_MAIN_MENU_WIDTH,GO_MAIN_MENU_HEIGHT);
    this.ctx.strokeRect(GO_MAIN_MENU_X,GO_MAIN_MENU_Y,GO_MAIN_MENU_WIDTH,GO_MAIN_MENU_HEIGHT);
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'normal 25px SquareFont'
    this.ctx.fillText('MAIN MENU',GO_MAIN_MENU_TEXT_X,GO_MAIN_MENU_TEXT_Y);
    this.ctx.closePath();
  }

  //draw Dotted line--------------------------------------------------------------------------------------------------
  drawDottedLine() {
    if(this.gameStatus === 'inGame' && this.shootStatus === false) {
      for (let i = 0; i < this.dottedLine.length; i++) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'white';
        this.ctx.globalAlpha = .5;
        this.ctx.arc(this.dottedLine[i][0], this.dottedLine[i][1], DOT_RADIUS, 0, Math.PI * 2, true);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        this.ctx.closePath();
      }
    }
  }

  //setting colors for current level----------------------------------------------------------------------------------
  setColorChangeIndex() {
    if(this.level === 1){
      this.colorChange = 0;
    }else if(this.level > 1) {
      this.colorChange = Math.floor(GREEN_MAX / (this.level-1));
    }
  }

  drawAnimation() {
    for(let i=0;i<this.animation.length;i++) {
      this.animation[i].draw();
    }
    let tempArray = this.animation.slice();
    for(let i = 0;i<tempArray.length;tempArray++){
      if(tempArray[i].opacityIndex <= 0){
        this.animation.splice(this.animation.indexOf(this.animation[i]),1);
      }
    }
  }

  //reset game
  reset(){
    this.gameTime = TOTAL_TIME;
    this.level = 1;
    this.colorChange = 0;
    this.gameTimeSec = '00';
    this.gameTimeMin = '30';
    this.timerCounter = 0;
    this.timerColor = TIMER_COLOR[getRandomNumber(TIMER_COLOR.length - 1 , 0)];
    this.gameStatus = 'inGame';
    this.coin = 0;
    this.addBalls = 0; //number of balls to add on next level
    this.totalBalls = 1;
    this.shootStatus = false;
    this.ballsLeft = this.totalBalls; //number of balls moving i.e. not dead
    this.ballsCounter = 0;
    this.firstDeadBallX = null;
    this.flagPowerUps = [];
    this.plus1Score = []; //for storing +1 symbol objects
    this.ballsArray = [];
    this.ballsArray.push(new Ball(this.ctx,this));
    this.bbtanGameBot = new BbtanGameBot(this.ctx,this.ballsArray[0].x);
    this.ballsLeftPosX = this.ballsArray[0].x;
    this.obstacles = [];
    this.tileMap = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ];
    this.levelMap = [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,3,0,0,0,0,0],
      [0,0,0,0,0,0,0]
    ];
  }
}


//main game program-------------------------------------------------------------------------------------------------
let game = new Game();
let raf;
game.spriteSheet.onload = () => {
  draw();
};


//main draw for game---------------------------------------------------------------------------------------------------
function  draw() {
  if(game.gameStatus === 'inGame' || game.gameStatus === 'gameOver' || game.gameStatus === 'nextLevel'){
    game.obstacles = [];
    let obstacle = null;
    let powerUp = null;
    let score;
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    if(game.gameStatus === 'nextLevel'){
      game.animateToNextLevel(obstacle,powerUp);
    }else {
      //  game.ctx.strokeRect(0,TOP_HEIGHT, GAME_WIDTH,GAME_HEIGHT-TOP_HEIGHT-BOT_HEIGHT);
      for (let i = 0; i < game.tileMap.length; i++) {
        let row = game.tileMap[i];
        for (let j = 0; j < TILE_WIDTH; j++) {
          let index = row[j];
          switch (index) {
            case SQUARE:
              obstacle = new ObsSquare(game.ctx, i, j, game);
              obstacle.drawSquare(game.levelMap[i][j]);
              game.obstacles.push([obstacle, SQUARE]);
              break;
            // case TRIANGLE_BOT_LEFT:
            //   obstacle = new ObsTriangleBotLeft(game.ctx,i,j);
            //   obstacle.drawTriangleBotLeft(game.levelMap[i][j]);
            //   break;
            // case TRIANGLE_BOT_RIGHT:
            //   obstacle = new ObsTriangleBotRight(game.ctx,i,j);
            //   obstacle.drawTriangleBotRight(game.levelMap[i][j]);
            //   break;
            // case TRIANGLE_TOP_LEFT:
            //   obstacle = new ObsTriangleTopRight(game.ctx,i,j);
            //   obstacle.drawTriangleTopRight(game.levelMap[i][j]);
            //   break;
            // case TRIANGLE_TOP_RIGHT:
            //   obstacle = new ObsTriangleTopLeft(game.ctx,i,j);
            //   obstacle.drawTriangleTopLeft(game.levelMap[i][j]);
            //   break;
            case COIN:
              powerUp = new PowerUps(game.ctx, i, j, game.spriteSheet, 0); //type 0 for coin
              powerUp.drawCoin();
              game.obstacles.push([powerUp, COIN]);
              break;
            case PLUS_BALL:
              powerUp = new PowerUps(game.ctx, i, j, game.spriteSheet, 1); //type 1 for plus
              powerUp.drawPlus();
              game.obstacles.push([powerUp, PLUS_BALL]);
              break;
            case POWER_HORZ:
              powerUp = new PowerUps(game.ctx, i, j, game.spriteSheet, 2); //type 2 for power horizontal
              powerUp.drawPowerHorizontal();
              game.obstacles.push([powerUp, POWER_HORZ]);
              game.flagPowerUps.push([i, j, false]);
              break;
            case POWER_SPLIT:
              powerUp = new PowerUps(game.ctx, i, j, game.spriteSheet, 3); //type 4 for power split
              powerUp.drawPowerSplit();
              game.obstacles.push([powerUp, POWER_SPLIT]);
              game.flagPowerUps.push([i, j, false]);
              break;
            case POWER_VERT:
              powerUp = new PowerUps(game.ctx, i, j, game.spriteSheet, 4); //type 3 for power vertical
              powerUp.drawPowerVertical();
              game.obstacles.push([powerUp, POWER_VERT]);
              game.flagPowerUps.push([i, j, false]);
              break;
            case PLUS_1:
              score = new Plus1(game.ctx, i, j); //displaying +1 after eating coins or addBallPowerUp
              score.drawPlus1();
              break;
            case DOUBLE_SQUARE:
              obstacle = new ObsSquareDouble(game.ctx, i, j, game);
              obstacle.drawSquare(game.levelMap[i][j]);
              game.obstacles.push([obstacle, DOUBLE_SQUARE]);
            default:
            //do nothing
          }
        }
      }
    }
    game.bgTop.drawBbtanBgTop(game.gameStatus);
    game.bgBot.drawBbtanBgBot(game.gameStatus, game);
    game.botScoreBoard.drawBotScoreBoards(game.level);
    game.drawBallsLeft();
    game.updatePlusOneSymbol(); //for maintaining animation of +1 symbol while eating powerUps
    for (let i = 0; i < game.ballsArray.length; i++) {
      game.ballsArray[i].updateBall(game, i); //update ball position, moves the ball in the canvas
      game.checkCollision(game.ballsArray[i]);
      game.ballsArray[i].drawBall();
    }
    //check time and change it accordingly-----------------------------------------------------------------------------
    game.timer();
    game.drawTime();
    // game.bbtanGameBot.drawBbtanBot(game.gameStatus, game);
    game.drawDottedLine();
    //display only for gameover----------------------------------------------------------------------------------------
    if (game.gameStatus === 'gameOver') {
      game.drawGameOver();
    }
    game.drawAnimation();
  }else if(game.gameStatus === 'startMenu'){
    game.drawStartMenu();
    game.gameSound.play('startGame');
  }
  raf = window.requestAnimationFrame(draw);
}

//for shooting the ball click event listener-------------------------------------------------------------------------
game.canvas.addEventListener('click',(evt)=> {
  shootBalls(game, evt, shootingAngle);
  checkClickOperation(game, evt);
});

//for direction on mouse over----------------------------------------------------------------------------------------
game.canvas.addEventListener('mousemove',(evt)=> {
  if(game.gameStatus === 'inGame' && game.shootStatus === false) {
    drawDottedLine(game,evt);
  }
});

//for direction on mouse over----------------------------------------------------------------------------------------
game.canvas.addEventListener('mouseout',(evt)=> {
  if(game.gameStatus === 'inGame' && game.shootStatus === false) {
    game.dottedLine = [];
  }
});

//shooting the ball after clicking -----------------------------------------------------------------------------------
function shootBalls(game,evt,shootingAngle) {
  if(game.gameStatus != 'paused' && game.gameStatus!='startMenu') {
    if (getShootCoOrdinates(game.canvas, evt)) {
      if (game.checkDeadBall() && game.gameStatus === 'inGame') {
        game.shootStatus = true;
        game.dottedLine = [];
        for (let j = 0; j < game.ballsArray.length; j++) {
          game.ballsArray[j] = setShootingAngle(game.canvas, evt, game.ballsArray[j], j, game, shootingAngle);
          game.ballsArray[j].setOffSetX(j);
        }
      }
    }
  }
}


//check which game state is and where user clicked--------------------------------------------------------------------
function checkClickOperation(game, evt) {
  if (game.gameStatus === 'paused') {
    if (checkCoOrdinates(game.canvas,evt,game) === 'resumed') {
      game.gameStatus = 'inGame';
      game.gameSound.play('button');
    }else if(checkCoOrdinates(game.canvas, evt,game) === 'restart') {
      game.reset();
      game.updateTileMap();
      game.gameSound.play('button');
    }else if(checkCoOrdinates(game.canvas, evt,game) === 'start-menu') {
      game.gameStatus = 'startMenu';
      game.gameSound.startGameflag = true;
      game.gameSound.play('button');
    }
  }else if(game.gameStatus === 'inGame'){
    if (checkCoOrdinates(game.canvas,evt,game) === 'paused') {
      game.gameStatus = 'paused';
      game.drawPauseMenu();
      game.gameSound.play('button');
    }
  }else if(game.gameStatus === 'startMenu') {
    if(checkCoOrdinates(game.canvas,evt,game) === 'play'){
      game.reset();
      game.updateTileMap();
      game.gameSound.play('button');
    }
  }else if(game.gameStatus === 'gameOver') {
    if(checkCoOrdinates(game.canvas,evt,game) === 'play'){
      game.reset();
      game.updateTileMap();
      game.gameSound.play('button');
    }else if(checkCoOrdinates(game.canvas,evt,game) === 'start-menu') {
      game.gameStatus = 'startMenu';
      game.gameSound.startGameflag = true;
      game.gameSound.play('button');
    }
  }
}









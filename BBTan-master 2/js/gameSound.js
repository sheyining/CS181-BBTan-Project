class GameSound {
  constructor()
  {
    this.startGameflag = true;
    this.pressButton = new Audio('sounds/button.mp3');
    this.gameOver = new Audio('sounds/gameover.mp3');
    this.startGame = new Audio('sounds/startGame.mp3');
  }

  play(element){
    if (element == 'gameOver') {
      this.gameOver.pause();
      this.gameOver.currentTime = 0;
      this.gameOver.play();
    } else if (element == 'button') {
      this.pressButton.pause();
      this.pressButton.currentTime = 0;
      this.pressButton.play();
    } else if (element == 'startGame' && this.startGameflag) {
      this.startGame.pause();
      this.startGame.currentTime = 0;
      this.startGame.play();
      this.startGameflag = false;
    }
  }
}
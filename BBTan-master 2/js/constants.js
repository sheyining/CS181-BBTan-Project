const TOP_HEIGHT = 60;
const BOT_HEIGHT = 114;
const BOT_BG_HEIGHT = 61;
const BOT_SCORE = BOT_HEIGHT - BOT_BG_HEIGHT;
const GAME_WIDTH = 350;
const GAME_HEIGHT = 450 + TOP_HEIGHT + BOT_HEIGHT;
const TILE_COLUMNS = 7;
const TILE_ROWS = 9;
const TILE_PADDING = 3;//for seperating the obstacles
const TILE_PAD_POWER = 12;//for separating power-ups
const TILE_PAD_SQUARE = TILE_PADDING * 2;
const TILE_WIDTH = Math.floor(GAME_WIDTH/7);
const TILE_HEIGHT = Math.floor((GAME_HEIGHT - TOP_HEIGHT - BOT_HEIGHT)/9);
const OBSTACLE_WIDTH = TILE_WIDTH - TILE_PAD_SQUARE;
const OBSTACLE_HEIGHT = TILE_HEIGHT - TILE_PAD_SQUARE;
const LINE_WIDTH = 3;
const POWER_UPS_WIDTH = OBSTACLE_WIDTH/2 + 5; //inside tile
const POWER_UPS_HEIGHT = OBSTACLE_HEIGHT/2 + 5; // inside tile
const BALL_RADIUS = 5;
const BALL_VELOCITY = 8;
const BALL_Y_DEAD = GAME_HEIGHT - BALL_RADIUS - 2 - BOT_HEIGHT;
const BALL_GAP = 30;
const BOT_VELOCITY = 10;
const NEXT_LEVEL_SLIDE_SPEED = .025;

//Sprite-Sheet locations and dimensions-------------------------------------------------------------------------------
const POWER_UPS_X = 210;
const POWER_UPS_Y = 361;
const POWER_UPS_SIZE = 29; //square image so same for height and width
const BBTAN_GAME_BOT_X = 72;
const BBTAN_GAME_BOT_Y = 361;
const BBTAN_GAME_BOT_WIDTH = 137; //for spritesheet width
const BBTAN_GAME_BOT_HEIGHT = 251; //for spritesheet height
const BBTAN_BOT_GAME_WIDTH = 73; //for canvas setting the width
const BBTAN_BOT_GAME_HEIGHT = BOT_BG_HEIGHT * 2; // for canvas setting the height
const BBTAN_GAME_BOT_ROT_X = BBTAN_GAME_BOT_X + BBTAN_GAME_BOT_WIDTH;
const BBTAN_GAME_BOT_ROT_Y = BBTAN_GAME_BOT_Y + POWER_UPS_SIZE;
const BBTAN_GAME_BOT_ROT_WIDTH = 151; //for spritesheet width
const BBTAN_GAME_BOT_ROT_HEIGHT = 256; //for spritesheet height
const BBTAN_BOT_ROT_GAME_WIDTH = 78; //for canvas setting the width
const BBTAN_BOT_ROT_GAME_HEIGHT = BOT_BG_HEIGHT * 2; // for canvas setting the height


//Ball shooting angle limit and BBTAN BOT rotate---------------------------------------------------------------------
const LOWEST_ANGLE = 0.26;

//TILE_MAPPING--------------------------------------------------------------------------------------------------------
const BLANK = 0;
const SQUARE = 1;
const TRIANGLE_BOT_LEFT = 2;
const TRIANGLE_BOT_RIGHT = 3;
const TRIANGLE_TOP_LEFT = 4;
const TRIANGLE_TOP_RIGHT = 5;
const COIN = 6;
const PLUS_BALL = 7
const POWER_HORZ = 8;
const POWER_SPLIT = 9;
const POWER_VERT = 10;
const PLUS_1 = 11;
const DOUBLE_SQUARE = 12;
const TOTAL_TIME = 1800; //30 mins in seconds

//dimensions for obstacles when collision occurs----------------------------------------------------------------------
const PADDING_SQUARE = 4;
const PADDING_SQUARE_X2 = PADDING_SQUARE * 2;

//ball shoot direction dots gap---------------------------------------------------------------------------------------
const DOT_GAP = 15;
const DOT_RADIUS = 2;

//co-ordinates for pause button and ques-mark-------------------------------------------------------------------------
const PAUSE_X = 10;
const PAUSE_Y = 10;
const PAUSE_WIDTH = TILE_WIDTH/1.5;
const PAUSE_GAP_X = PAUSE_X + PAUSE_WIDTH/2.6;
const PAUSE_GAP_WIDTH = 7;
const PAUSE_HEIGHT = TILE_HEIGHT/1.5;
const QUES_MARK_X = PAUSE_X + PAUSE_WIDTH + PAUSE_X + PAUSE_X/2;
const QUES_MARK_Y = TOP_HEIGHT/1.44;
const TIMERX = GAME_WIDTH/3;
const TIMERY = GAME_HEIGHT - 11;

//colors for time ----------------------------------------------------------------------------------------------------
const TIMER_COLOR = ['#e6644a','#f344bb','#7eff3e','#bd0000','#f10b1c','#eb0cc4','#9a0ceb','#1c0ceb','#43bbe7','#10c379','#0d7d05','#d2de15','#d0700a','#b51909','white'];

//co-ordinates for pause menu-----------------------------------------------------------------------------------------
const PAUSE_MENU_X = 20;
const PAUSE_MENU_Y = TOP_HEIGHT+20;
const PAUSE_MENU_WIDTH = GAME_WIDTH-40;
const PAUSE_MENU_HEIGHT = GAME_HEIGHT-TOP_HEIGHT-BOT_HEIGHT-100;
const RESUME_X = PAUSE_MENU_WIDTH/3.2;
const RESUME_Y = TOP_HEIGHT + 100;
const RESUME_WIDTH = PAUSE_MENU_WIDTH/2;
const RESUME_HEIGHT = 40;
const RESUME_TEXT_X = RESUME_X+32;
const RESUME_TEXT_Y = RESUME_Y+28;
const RESTART_X = PAUSE_MENU_WIDTH/3.2;
const RESTART_Y = RESUME_Y+RESUME_HEIGHT+30;
const RESTART_WIDTH = PAUSE_MENU_WIDTH/2;
const RESTART_HEIGHT = 40;
const RESTART_TEXT_X = RESTART_X+30;
const RESTART_TEXT_Y = RESUME_Y+RESUME_HEIGHT+58;
const MAIN_MENU_X = PAUSE_MENU_WIDTH/3.2;
const MAIN_MENU_Y = RESTART_Y+RESTART_HEIGHT+30;
const MAIN_MENU_WIDTH = PAUSE_MENU_WIDTH/2;
const MAIN_MENU_HEIGHT = 40;
const MAIN_MENU_TEXT_X = MAIN_MENU_X+20;
const MAIN_MENU_TEXT_Y = RESTART_Y+RESTART_HEIGHT+58;

//start menu text ---------------------------------------------------------------------------------------------------
const START_TEXT = ' WHAT HAPPENS AFTER 30M.. ';
const START_TEXT_LENGTH = 560;
const START_MENU_TEXT_VELOCITY = 1.5;

//BBTAN LOGO dimensions ----------------------------------------------------------------------------------------------
const LOGO_GAME_X = 57;
const LOGO_GAME_Y = GAME_HEIGHT/2.5;
const LOGO_GAME_WIDTH = GAME_WIDTH - (LOGO_GAME_X*2);
const LOGO_GAME_HEIGHT = 83;
const LOGO_WIDTH = 393;
const LOGO_HEIGHT = 138;

//START MENU PLAY BUTTON-----------------------------------------------------------------------------------------------
const PLAY_BTN_X = 156;
const PLAY_BTN_Y = 139;
const PLAY_BTN_WIDTH = 156;
const PLAY_BTN_HEIGHT = 77;
const PLAY_BTN_GAME_X = GAME_WIDTH/3
const PLAY_BTN_GAME_Y = LOGO_GAME_Y + LOGO_GAME_HEIGHT +70;
const PLAY_BTN_GAME_WIDTH = GAME_WIDTH - (2*PLAY_BTN_GAME_X);
const PLAY_BTN_GAME_HEIGHT = 50;

//START menu ball bounce height ---------------------------------------------------------------------------------------
const BOUNCE_HEIGHT = 40;

//START Menu BBTAN BOT ------------------------------------------------------------------------------------------------
const START_BOT_X = 0;
const START_BOT_Y = 361;
const START_BOT_WIDTH = 72;
const START_BOT_HEIGHT = 208;
const START_BOT_GAME_X = 57;
const START_BOT_GAME_Y = TOP_HEIGHT + 30;
const START_BOT_GAME_WIDTH = 60;
const START_BOT_GAME_HEIGHT = 160;
const START_BOT_VELOCITY = .5;

//GAME OVER menu-------------------------------------------------------------------------------------------------------
const GAMEOVER_BG_X = 0;
const GAMEOVER_BG_Y = TOP_HEIGHT/.7;
const GAMEOVER_BG_WIDTH = GAME_WIDTH;
const GAMEOVER_BG_HEIGHT = GAME_HEIGHT/3;
const GAMEOVER_BG_BOT_X = 0;
const GAMEOVER_BG_BOT_Y = GAMEOVER_BG_Y + GAMEOVER_BG_HEIGHT +20;
const GAMEOVER_BG_BOT_WIDTH = GAME_WIDTH;
const GAMEOVER_BG_BOT_HEIGHT = TOP_HEIGHT*1.5;
const GAMEOVER_SCORE_X = GAME_WIDTH/5;
const GAMEOVER_SCORE_Y = GAMEOVER_BG_Y + 70;
const GAMEOVER_SCORE_NUM_X = GAME_WIDTH/1.6;
const GAMEOVER_SCORE_NUM_Y = GAMEOVER_SCORE_Y + 6;
const GAMEOVER_BEST_SCORE_X = GAME_WIDTH/4;
const GAMEOVER_BEST_SCORE_Y = GAMEOVER_SCORE_NUM_Y + 80;
const GAMEOVER_BEST_SCORE_NUM_X = GAME_WIDTH/1.6;
const GAMEOVER_BEST_SCORE_NUM_Y = GAMEOVER_BEST_SCORE_Y + 6;
const GAMEOVER_COIN_X = GAME_WIDTH/3;
const GAMEOVER_COIN_Y = GAMEOVER_BG_BOT_Y + 20;
const GAMEOVER_COIN_WIDTH = TILE_WIDTH;
const GAMEOVER_COIN_HEIGHT = TILE_HEIGHT;
const GAMEOVER_COIN_TEXT_X = GAMEOVER_COIN_X + GAMEOVER_COIN_WIDTH + 20;
const GAMEOVER_COIN_TEXT_Y = GAMEOVER_COIN_Y + 45;
const GO_MAIN_MENU_X = 10;
const GO_MAIN_MENU_Y = GAMEOVER_BG_BOT_Y + GAMEOVER_BG_BOT_HEIGHT + 20;
const GO_MAIN_MENU_WIDTH = GAME_WIDTH/2.2;
const GO_MAIN_MENU_HEIGHT = GAME_HEIGHT/8.8;
const GO_MAIN_MENU_TEXT_X = GO_MAIN_MENU_X+20;
const GO_MAIN_MENU_TEXT_Y = GO_MAIN_MENU_Y+45;
const PLAY_AGAIN_X = GO_MAIN_MENU_X + GO_MAIN_MENU_WIDTH + 10;
const PLAY_AGAIN_Y = GAMEOVER_BG_BOT_Y + GAMEOVER_BG_BOT_HEIGHT + 20;
const PLAY_AGAIN_WIDTH = GAME_WIDTH/2.2;
const PLAY_AGAIN_HEIGHT = GAME_HEIGHT/8.8;
const PLAY_AGAIN_TEXT_X = PLAY_AGAIN_X+15;
const PLAY_AGAIN_TEXT_Y = PLAY_AGAIN_Y+45;

//RGB color code max and min------------------------------------------------------------------------------------------
const RED = 255;
const GREEN_MAX = 255;
const GREEN_MIN = 0;
const BLUE = 102;

////RGB color code for double level max and min------------------------------------------------------------------------------------------
const RED_DOUBLE = 0;
const BLUE_DOUBLE = 255;

//exploding animation constants---------------------------------------------------------------------------------------
const NUMBER_OF_SQUARES = 25;
const ANGLE_DIFF = (Math.PI/2)/((NUMBER_OF_SQUARES/4)-1);

//angle for only one quadrant-----------------------------------------------------------------------------------------
let angleForAnimation = [];
for(let i=0;i<(NUMBER_OF_SQUARES/4);i++){
  angleForAnimation.push((i*ANGLE_DIFF));
}

const MAX_SQUARE_WIDTH = OBSTACLE_WIDTH/6;
const MIN_SQUARE_WIDTH = OBSTACLE_WIDTH/8;
const MAX_SQUARE_HEIGHT = OBSTACLE_HEIGHT/6;
const MIN_SQUARE_HEIGHT = OBSTACLE_HEIGHT/8;
const ANIMATE_VELOCITY_MAX = 1;
const ANIMATE_VELOCITY_MIN = .25;
const OPACITY_VELOCITY = .02;

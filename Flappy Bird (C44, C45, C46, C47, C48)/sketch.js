var bg, bgImg
var bottomGround
var topGround
var bird, birdImg
var topPipe, bottomPipe
var topPipeGroup, bottomPipeGroup
var topPipeImg, bottomPipeImg;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;
var gameOver, gameOverImg, restart, restartImg, coin, coinImg, title, titleImg, deadBird, deadBirdImg;
var coinSound, jumpSound, dieSound;
var coinGroup, coin;
var birdSound;

function preload() {
  bgImg = loadImage("assets/City.webp")
  topPipeImg = loadImage("assets/Bottom Pipe.png")
  bottomPipeImg = loadImage("assets/Top Pipe.png")
  birdImg = loadAnimation("assets/Bird0.png", "assets/Bird1.png", "assets/Bird2.png", "assets/Bird3.png")
  gameOverImg = loadImage("assets/GameOver.png")
  restartImg = loadImage("assets/Restart.png")
  coinImg = loadImage("assets/coin.png")
  titleImg = loadImage("assets/Logo.png")
  deadBirdImg = loadAnimation("assets/Dead Bird.png")

  coinSound = loadSound("assets/coin sound.wav")
  jumpSound = loadSound("assets/jump.mp3")
  dieSound = loadSound("assets/die.mp3")
  birdSound = loadSound("assets/birdSound.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  
  //background image
  bg = createSprite(displayWidth / 2 - 20, displayHeight / 2 - 40, 20, 20);
  bg.addImage(bgImg);
  bg.scale = 1

  //creating top and bottom grounds
  bottomGround = createSprite(50, 600, 1600, 20);
  bottomGround.visible = false;

  topGround = createSprite(50, 20, 1000, 20);
  topGround.visible = false;

  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg)
  gameOver.visible = false;

  restart = createSprite(width / 2, height / 2 + 150);
  restart.addImage(restartImg)
  restart.visible = false;
  restart.scale = 0.45

  //creating bird     
  bird = createSprite(100, 200, 5, 5);
  bird.addAnimation("bird", birdImg);
  bird.scale = 0.3;
  bird.addAnimation("dead", deadBirdImg);
  bird.debug = false;
  bird.setCollider("rectangle", 0, 0, 1, 1);

  topPipeGroup = new Group();
  bottomPipeGroup = new Group();
  coinGroup = new Group();

}

function draw() {

  background("red");

  if (gameState === PLAY) {
    //birdSound.loop();
    bg.velocityX = -5;
    bird.changeAnimation("bird", birdImg);
    //making the hot air bird jump
    if (keyDown("space") && bird.y >= height - 500 || bird.y >= height - 50) {
      bird.velocityY = -6;
      //jumpSound.play();
    }

    //adding gravity
    bird.velocityY = bird.velocityY + 2;
    if (bg.x < 250) {
      bg.x = bg.width / 2;
    }

    spawnTopPipe();
    spawnBottomPipe();
    spawnCoins();
    if (coinGroup.collide(bird)) {
      coinSound.play();
      coinGroup.destroyEach();
      //destroyCoin();
      score = score + 2;
    }
    if (topPipeGroup.isTouching(bird) || bottomPipeGroup.isTouching(bird)) {
      gameState = END
      dieSound.play();
    }
  }
  else if (gameState === END) {
    bird.changeAnimation("dead", deadBirdImg);
    bird.scale = 0.20;
    gameOver.visible = true;
    restart.visible = true;
    bird.velocityY = 0;
    bird.velocityX = 0;
    topPipe.depth = bird.depth;
    bird.depth += 1
    bird.velocityY = bird.velocityY + 4;
    bg.velocityX = 0;
    topPipeGroup.setVelocityXEach(0);
    bottomPipeGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    bird.collide(bottomGround);
    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
  fill("black");
  textSize(30);
  text("Score:"+score,50,100);

}
function destroyCoin() {
  var children = coinGroup.getAll();
  children[children.length - 1].kill();
}

function reset() {
  gameState = PLAY;
  topPipeGroup.destroyEach();
  bottomPipeGroup.destroyEach();
  coinGroup.destroyEach();
  gameOver.visible = false;
  restart.visible = false;
  bird.scale = 0.3;
  score = 0;
}

function spawnCoins() {
  if (World.frameCount % 50 === 0) {
    coin = createSprite(displayWidth - 10, 300, 20, 20);
    coin.addImage(coinImg);
    coin.scale = 0.1
    coin.y = Math.round(random(300, 450))
    coin.velocityX = -4;
    coinGroup.add(coin)
    coin.debug = false;
  }
}

function spawnTopPipe() {
  if (World.frameCount % 90 === 0) {
    topPipe = createSprite(displayWidth - 10, displayHeight / 2 - 200, 20, 20);
    topPipe.addImage(topPipeImg);
    topPipe.scale = 0.70
    topPipe.y = Math.round(random(10, 100))
    topPipe.velocityX = -4;
    topPipeGroup.add(topPipe)
  }
}

function spawnBottomPipe() {
  if (World.frameCount % 90 === 0) {
    bottomPipe = createSprite(displayWidth - 10, displayHeight - 10, 20, 20);
    bottomPipe.addImage(bottomPipeImg);
    //bottomPipe.setCollider("retangle")
    bottomPipe.scale = 0.70
    bottomPipe.y = Math.round(random(500, 600))
    bottomPipe.velocityX = -4;
    bottomPipeGroup.add(bottomPipe)
  }
}
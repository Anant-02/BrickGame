"use strict";

const levelSize = vec2(38, 20);

let ball;
let score = 0;
let paddle;

const break_sound = new Sound([
  ,
  ,
  258,
  0.01,
  0.06,
  0.25,
  1,
  0.4,
  ,
  ,
  ,
  ,
  0.01,
  ,
  2.6,
  ,
  ,
  0.54,
  0.09,
  0.24,
  -2276,
]); // Hit 138
const sound_bounce = new Sound([
  1.1,
  ,
  10,
  0.01,
  0.05,
  0.01,
  4,
  4.6,
  ,
  ,
  ,
  ,
  0.01,
  ,
  ,
  ,
  0.05,
  0.69,
  0.03,
  0.07,
  -1200,
]); // Blip 13
const sound_start = new Sound([
  5,
  ,
  563,
  0.01,
  0.09,
  0.11,
  1,
  3.4,
  ,
  ,
  458,
  0.09,
  0.04,
  ,
  ,
  0.1,
  ,
  0.98,
  0.03,
  ,
  -1438,
]); // Pickup 140])

class Paddle extends EngineObject {
  constructor() {
    super(vec2(0, 1), vec2(6, 0.5));
    this.setCollision();
    this.mass = 0;
  }

  update() {
    this.pos.x = mousePos.x;
    this.pos.x = clamp(
      this.pos.x,
      this.size.x / 2,
      levelSize.x - this.size.x / 2
    );
  }
}

class Ball extends EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5));
    this.setCollision();
    this.velocity = vec2(-0.1, -0.1);
    this.elasticity = 1;
  }

  collideWithObject(o) {
    if(o == paddle && this.velocity.y > 0) {
        return 0;
    }

    sound_bounce.play();

    if(o == paddle) {
        const deltaX = this.pos.x - o.pos.x;
        this.velocity = this.velocity.rotate(.3*deltaX);
        this.velocity.y = max(-this.velocity.y, .2);
        const speed = min(1.1*this.velocity.length(), .5);
        this.velocity = this.velocity.normalize(speed);
        return 0;
    }
    return 1;
  }
}

class Wall extends EngineObject {
  constructor(pos, size) {
    super(pos, size);
    this.setCollision();
    this.mass = 0;
    this.color = new Color(0, 0, 0, 0);
  }
}

class Brick extends EngineObject {
  constructor(pos, size) {
    super(pos, size);
    this.setCollision();
    this.mass = 0;
    this.color = randColor();
  }

  collideWithObject(o) {
    this.destroy();
    break_sound.play();
    score++;
    return 1;
  }
}

function gameInit() {
  canvasFixedSize = vec2(1280, 720);

  for (let x = 2; x <= levelSize.x - 2; x += 2)
    for (let y = 12; y <= levelSize.y - 2; y++) {
      const brick = new Brick(vec2(x, y), vec2(2, 1));
    }

  cameraPos = levelSize.scale(0.5);

  paddle = new Paddle();
  new Wall(vec2(levelSize.x / 2, levelSize.y + 0.5), vec2(100, 1));
  new Wall(vec2(-0.5, levelSize.y / 2), vec2(1, 100));
  new Wall(vec2(levelSize.x + 0.5, levelSize.y / 2), vec2(1, 100));
}

function gameUpdate() {
  drawRect(cameraPos, vec2(100), new Color(0.5, 0.5, 0.5));
  drawRect(cameraPos, levelSize, new Color(0.1, 0.1, 0.1));

  if (ball && ball.pos.y < -1) {
    if (ball) ball.destroy();
    ball = 0;
  }
  if (!ball && mouseWasPressed(0)) {
    score = 0;
    ball = new Ball(cameraPos);
    sound_start.play();
  }
}

function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
}

function gameRenderPost() {
  drawTextScreen(`Score :  ${score}`, vec2(mainCanvasSize.x / 2, 70), 40);
  // called after objects are rendered
  // draw effects or hud that appear above all objects
}

// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);

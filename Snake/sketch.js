var s;
var p;
var scl = 30;
var cols = 20;
var rows = 20;
var food;
var snakes = [];
var heads = [];

var multiplayer = false;

function setup() {
  createCanvas(cols*scl,rows*scl);
  frameRate(5);
  pickLocation();
  s = new Snake();
  p = new Snake();
  s.color = [255,0,0];
  p.color = [0,255,0];
}

function pickLocation() {
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

function draw() {
  background(0);

  if (s.eat(food)) {
    pickLocation();
  } else if (p.eat(food)) {
    pickLocation();
  }
    
  p.death();
  s.death();

  if (!p.dead && !s.dead) {
      if (!multiplayer) s.AI();
      s.update();
      p.update();
  } else if (p.counter > 10 || s.counter > 10) {
      s.counter = 0;
      p.counter = 0;
      
      s.dead = false;
      p.dead = false;
      
      snakes = [];
      s.tail = [];
      s.total = 0;
      p.tail = [];
      p.total = 0;
      
      s.x = scl*floor(random(cols));
      s.y = scl*floor(random(rows));
      
      p.x = scl*floor(random(cols));
      p.y = scl*floor(random(rows));      
  }
    
  for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
          fill(50)
          strokeWeight(3)
          rect(i*scl,j*scl,scl,scl)
      }
  }
    
  fill(255,255,255);
  rect(food.x, food.y, scl, scl);
    
  s.show();
  p.show();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
      if (p.yspeed != 1) {
          p.dir = [0, -1];   
      }
  } else if (keyCode === DOWN_ARROW) {
      if (p.yspeed != -1) {
          p.dir = [0,1];
      }
  } else if (keyCode === RIGHT_ARROW) {
      if (p.xspeed != -1) {
          p.dir = [1,0];
      }
  } else if (keyCode === LEFT_ARROW) {
      if (p.xspeed != 1) {
          p.dir = [-1,0];
      }
  }
    
  if (keyCode === 87) {
      if (s.yspeed != 1) {
          s.dir = [0, -1];   
      }
  } else if (keyCode === 83) {
      if (s.yspeed != -1) {
          s.dir = [0,1];
      }
  } else if (keyCode === 68) {
      if (s.xspeed != -1) {
          s.dir = [1,0];
      }
  } else if (keyCode === 65) {
      if (s.xspeed != 1) {
          s.dir = [-1,0];
      }
  }
}
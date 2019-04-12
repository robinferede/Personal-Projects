function Snake(r,g,b) {
  this.x = scl*floor(random(cols));
  this.y = scl*floor(random(rows));
  this.xspeed = 1;
  this.yspeed = 0;
  this.dir = [1,0];
    
  this.total = 0;
  this.tail = [];
  this.color;
  this.dead = false;
  this.counter = 0;

  this.pos = function() {
      var pos = createVector(this.x,this.y);
      return pos;
  }
    
  this.eat = function(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d == 0) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  //removing the snake from snakes array
  this.remove = function() {
    var newsnakes = [];
    for (var i = 0; i < snakes.length; i++) {
        if (!snakes[i].equals(this.pos())) {
            var keep = true
            for (var j = 0; j < this.tail.length; j++) {
                if (snakes[i].equals(this.tail[j])) {
                    keep = false;
                    break;
                }
            }
            if (keep) newsnakes.push(snakes[i]);
        }
    }
    snakes = newsnakes.slice();
      
    for (var i = 0; i < heads.length; i++) {
        if (heads[i].x == this.x && heads[i].y == this.y) {
            heads.splice(i,1);
            break;
        }
    }
  }
  
  //adding snake to snakes array
  this.add = function() {
    for (var i = 0; i < this.tail.length; i++) {
        snakes.push(this.tail[i]);
    }
    snakes.push(this.pos());
    heads.push(this.pos());
  }
  
  this.death = function() {
    for (var i = 0; i < snakes.length; i++) {
        var pos = snakes[i]
        if (pos.x == this.x && pos.y == this.y) {
            snakes.splice(i,1);
            break
        }
    }
    
    for (var i = 0; i < snakes.length; i++) {
      var pos = snakes[i];
      if (pos.x == this.x && pos.y == this.y) {
        this.dead = true;
        break;
      }
    }
      
    if (this.dead) this.counter ++;
    
    snakes.push(this.pos());
  }

  this.update = function() {
    //removing the snake from the snakes array
    this.remove();
      
    this.xspeed = this.dir[0];
    this.yspeed = this.dir[1];
      
      
    //shifting the tail
    if (this.total === this.tail.length) {
      for (var i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = this.pos();
    
    //moving the snake
    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    if (this.x > width-scl) {
        this.x = width-scl;
        this.dead = true;
    }
    if (this.x < 0) {
        this.x = 0
        this.dead = true;        
    }
        
    if (this.y > height-scl) {
        this.y = height-scl;
        this.dead = true;
    }
    if (this.y < 0) {
        this.y = 0;
        this.dead = true;
    }

    //adding the snake to the snakes array
    this.add();
  }

  this.show = function() {
    fill(this.color);
    strokeWeight(3);
    if (Math.floor(this.counter)%2 == 1) {
        noFill();
    }
    for (var i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
    rect(this.x, this.y, scl, scl);

  }
  
  this.AI = function() {
    var up = createVector(0,-1);
    var down = createVector(0,1);
    var right = createVector(1,0);
    var left = createVector(-1,0);
    
    var moves = [up,down,right,left];
      
    for (var i = 0; i < moves.length; i++) {
        if (moves[i].x == -this.xspeed && moves[i].y == -this.yspeed) {
            moves.splice(i,1);
            break;
        }
    }
      
    var scores = [];
    var move;
    
    for (var i = 0; i < moves.length; i++) {
        var score = 0;
        var step = moves[i].copy();
        var newpos = createVector(this.x,this.y).add(step.mult(scl));
        
        if (dist(newpos.x,newpos.y,food.x,food.y) <
            dist(this.x,this.y,food.x,food.y)) {
            score += 1;
        }
        
        for (var j = 0; j < snakes.length; j++) {
            var pos = snakes[j];
            if (newpos.x == pos.x && newpos.y == pos.y) {
                score -= 100;
            }
        }
        
        if (newpos.x == width || newpos.y == height || newpos.x < 0 || newpos.y < 0) {
            score -= 100;
        }
        
        scores.push(score);
    }
    
    var highest = Math.max.apply(Math, scores)
    var move = scores.indexOf(highest)
    
    this.dir = [moves[move].x,moves[move].y];
  }
}
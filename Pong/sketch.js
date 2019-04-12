var ball;

function setup() {
    createCanvas(1600,1400);
    ball = new Ball();
    bar1 = new Bar();
    bar2 = new Bar();
    
    bar1.p.x = 0;
    bar1.p.y = height/2;
    
    bar2.p.x = width - bar2.d;
    bar2.p.y = height/2;
}

function draw() {
    background(50);
    ball.update();
    
    bar1.update();
    bar2.update();
    
    if (keyIsDown(87)) {
        bar1.v.y = -15;
    } else if (keyIsDown(83)) {
        bar1.v.y = 15;
    } else {
        bar1.v.y = 0;
    }
    
    if (keyIsDown(38)) {
        bar2.v.y = -15;
    } else if (keyIsDown(40)) {
        bar2.v.y = 15;
    } else {
        bar2.v.y = 0;
    }
}

function Ball() {
    this.radius = 20;
    this.velocity = 20;
    this.angle = PI*Math.random()/2-PI/4-PI*(Math.floor(random(2)))
    
    this.p = createVector(width/2,height/2);
    this.v = createVector(this.velocity*Math.cos(this.angle),
                          this.velocity*Math.sin(this.angle))
    
    this.update = function () {
        this.p.add(this.v);
        
        if (this.p.x < this.radius + bar1.d && this.v.x < 0) {
            if (this.p.y > bar1.p.y - bar1.h/2 &&
                this.p.y < bar1.p.y + bar1.h/2) {
                this.v.x *= -1;
                this.v.y += 0.1 * (bar1.v.y - this.v.y);
                
            } else if (this.p.x < 0) {
                ball = new Ball();
            }
        }
        
        if (this.p.x > width - this.radius - bar2.d && this.v.x > 0) {
            if (this.p.y > bar2.p.y - bar2.h/2 &&
                this.p.y < bar2.p.y + bar2.h/2) {
                this.v.x *= -1;
                this.v.y += 0.1 * (bar2.v.y - this.v.y);
                
            } else if (this.p.x > width) {
                ball = new Ball();
            }
        }
        
        if (this.p.y < this.radius || this.p.y > height - this.radius) {
            this.v.y *= -1;
        }
        
        fill(255);
        ellipse(this.p.x,this.p.y,2*this.radius,2*this.radius);
    }
}

function Bar() {
    this.p = new p5.Vector();
    this.v = createVector(0,0);
    
    this.d = 40;
    this.h = 400;
    
    this.update = function () { 
        this.p.add(this.v);
        this.p.y = constrain(this.p.y, this.h/2, height - this.h/2);
        
        fill(255);
        rect(this.p.x,this.p.y - this.h/2,this.d,this.h)
    }
}
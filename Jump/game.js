var man;
var g = 0.2;
var maxy = 0;
var pads = [];
var number = 1000
var v = 0

function setup() {
    createCanvas(400,600)
    man = new Jumper();
    man.x = 0;
    man.y = 0;
    
    base = new Pad();
    base.x = -width/2
    base.y = 0
    base.w = width;
    base.d = height/2;
    
    pads[0] = base;
    
    for (var i = 1; i < number; i++) {
        var pad = new Pad();
        pad.w = 100-(80/number)*i;
        pad.x = Math.random()*(400-pad.w)-200
        pad.y = i * -96;
        
        if (Math.random() < 0.1) pad.color = 255;
        
        if (Math.random() < 0.5 - i/number ||
            pads[pads.length - 1].y != -24*(i-1)) pads.push(pad);
    }
}

function draw() {
    background(0);
    translate(width/2,height/2-maxy);
    drawGrid();
    
    for (var i = 0; i < pads.length; i++) {
        pads[i].show();
        pads[i].update();
    }
    
    fill(255,0,0)
    textSize(50)
    text(round(-maxy/96),-width/2+4,maxy-height/2+40);
    fill(100)
    textSize(25)
    text("wauw goed gedaan knap hoor",40-width/2,-96100)
    
    if (keyIsDown(32)) man.vy = -100;
    
    man.show();
    man.update();
    
    for (var i = 0; i < touches.length; i++) {
        if (touches[i].x > width/2) man.vx = 4;
        if (touches[i].x < width/2) man.vx = -4;
    }
}

function Jumper() {
    this.x;
    this.y;
    this.vx = 0;
    this.vy = 0;
    this.h = 40;
    this.w = 20;
    
    this.show = function() {
        fill(255,0,0)
        noStroke()
        rect(this.x-this.w/2,this.y-this.h,this.w,this.h);
    }
    
    this.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (keyIsDown(RIGHT_ARROW)) this.vx = 4
        else if (keyIsDown(LEFT_ARROW)) this.vx = -4
        else this.vx *= 0.9;
        
        for (var i = 0; i < pads.length; i++) {
            if (this.x + this.w/2 > pads[i].x &&
                this.x - this.w/2 < pads[i].x + pads[i].w &&
                this.y >= pads[i].y  &&
                this.y <= pads[i].y + 10 &&
                this.vy > 0) {
                this.y = pads[i].y;
                this.vy = -9;
                if (pads[i].color == 255) this.vy = -40;
                pads[i].fall = false;
            }
        }
        
        if (this.y == 0) {
            this.vy = -9;
        }
        
        if (this.x < -width/2-this.w/2) this.x = width/2+this.w/2;
        if (this.x > width/2+this.w/2) this.x = -width/2-this.w/2;
        
        if (this.y < 0) this.vy += g;
        if (this.y > 0) {
            this.vy = 0;
            this.y = 0;
        }
        
        if (this.y < maxy) maxy = this.y;
        if (this.y > maxy + height/2) {
            this.y = 0;
            v += g;
            maxy += v;
        } else if (v != 0) {
            v = 0;
        }
    }
}

function Pad() {
    this.x;
    this.y;
    
    this.vx = 0;
    this.vy = 0;
    
    this.w ;
    this.d = 20;
    this.color = 100;
    this.fall = false;
    
    this.show = function() {
        fill(this.color)
        rect(this.x,this.y,this.w,this.d)
    }
    this.update = function() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.fall) this.vy += g;
    }
    
}

function drawGrid() {
    stroke(50)
    var step = 48
    strokeWeight(2)
    for (var i = Math.floor(-width/2); i < width/2; i++) {
        if (i % step == 0) line(i,maxy-height,i,maxy+height)
    }
    for (var i = Math.floor(maxy - height); i < maxy + height; i++){
        if (i % step == 0) line(-width/2,i,width/2,i)
    }
    strokeWeight(1)
    noStroke()
}
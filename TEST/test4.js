var angle =0

function setup() {
    createCanvas(700,700);
}

function draw() {
    background(0)
    stroke(255)    
    translate(mouseX,mouseY)
    
    points = [];
    v = createVector(0,255);
    w = createVector(0,0);
    
    for (var i = 0; i<1000; i++) {
        points.push(w.copy());
        w.add(v);
        v.rotate(PI-PI*angle/180);
    }
    
    for (var i = 998; i>=0; i--) {
        var p = (1-i/998);
        stroke(Math.pow(p,5)*255)
        line(points[i].x,points[i].y,points[i+1].x,points[i+1].y)
    }
    
    if (keyIsDown(UP_ARROW)) angle+=0.01
    if (keyIsDown(DOWN_ARROW)) angle-=0.01
}

function mouseWheel(event) {
    if (event.delta > 0) angle++
    if (event.delta < 0) angle--
}

function mousePressed() {
    console.log(angle);
    step = true
    for (var i = 1; i<100; i++) {
        if (angle > 360/i) {
            angle = 360/i
            step = false
            break
        } else if (-angle > 360/i) {
            angle = -360/i
            step = false
            break
        }
    }
    if (step) {
        var i = 360/angle;
        angle = 360/(angle+1)
    }
}
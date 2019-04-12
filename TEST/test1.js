var counter = 0;
var points = [];
var activate = false;

var cx = 0;
var cy = 0;

function setup() {
    counter = 0;
}

function draw() {
    createCanvas(window.innerWidth,window.innerHeight);
    background(0);
    stroke(255);
    noFill();
    smallest = Infinity;
    for (var i = 1; i < points.length && points.length > 1; i++) {
        line(points[i].x,points[i].y,points[i-1].x,points[i-1].y)
        
        var closest = closestPoint(points[i-1],points[i],createVector(mouseX,mouseY))[0];
        var distance = closestPoint(points[i-1],points[i],createVector(mouseX,mouseY))[1];
        
        if (distance < smallest) {
            smallest = distance;
            cx = closest.x;
            cy = closest.y;
        }
    }
    
    if (mouseIsPressed) points.push(createVector(mouseX,mouseY))
    
    ellipse(cx,cy,10,10);
}

function closestPoint(a,b,p) {
    var diff = p5.Vector.sub(b,a);
    var dir = diff.copy().normalize();
    var dis = p5.Vector.sub(p,a);
    var len = p5.Vector.dot(dir,dis);
    
    if (len > 0 && len < diff.mag()) {
        var closest = p5.Vector.mult(dir,len);
            closest.add(a);
    } else if (len < 0) {
        var closest = a.copy();
    } else {
        var closest = b.copy();
    }
    
    var distance = dist(closest.x,closest.y,p.x,p.y)
    
    return [closest,distance];
}
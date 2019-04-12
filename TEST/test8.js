//var points = []
var drag = false;
var step = 5;

var xpoints = [];
var ypoints = [];
var t = 0;

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
    background(0);
    noFill();
    stroke(255);
    
    
    for (var i = 0; i<t; i++) {
        ellipse(xpoints[i].y,ypoints[i].y,10,10);
    }
    
    for (var i = 0.01; i<t-1; i+=0.01) {
        line(L(i-0.01,xpoints),L(i-0.01,ypoints),L(i,xpoints),L(i,ypoints))
    }
    
//    for (var i = 0; i<points.length; i++) {
//        ellipse(points[i].x,points[i].y,10,10)
//    }
//    
//    for (var x = step; x<width; x+=step) {
//        line(x-step,L(x-step),x,L(x));
//    }
}

function L(x,points) {
    var sum = 0
    for (var i = 0; i<points.length; i++) {
        var xi = points[i].x;
        var yi = points[i].y;
        
        //Lagrange basis polynomials li(x)
        var li = 1;
        for (var j = 0; j<points.length; j++) {
            var xj = points[j].x;
            if (j!=i) li *= (x-xj)/(xi-xj);
        }
        
        sum += yi*li;
    }
    return sum;
}
    
function mouseClicked() {
    if (!drag) {
        xpoints.push(createVector(t,mouseX));
        ypoints.push(createVector(t,mouseY));
        t++;
    } else drag = false;
}

function mouseDragged() {
    drag = true;
    for (var i = 0; i < xpoints.length; i++) {
        if (dist(xpoints[i].y,ypoints[i].y,mouseX,mouseY) < 20) {
            xpoints[i].y = mouseX;
            ypoints[i].y = mouseY;
            break;
        }
    }
}
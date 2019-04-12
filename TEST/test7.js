var points = []
var drag = false;
var step = 5;

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
}

function draw() {
    background(0);
    noFill();
    stroke(255);
    
    for (var i = 0; i<points.length; i++) {
        ellipse(points[i].x,points[i].y,10,10)
    }
    
    for (var x = step; x<width; x+=step) {
        line(x-step,L(x-step),x,L(x));
    }
}

function L(x) {
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
        points.push(createVector(mouseX,mouseY));
    } else drag = false;
}

function mouseDragged() {
    drag = true;
    for (var i = 0; i < points.length; i++) {
        if (dist(points[i].x,points[i].y,mouseX,mouseY) < 20) {
            points[i].x = mouseX;
            points[i].y = mouseY;
            break;
        }
    }
}
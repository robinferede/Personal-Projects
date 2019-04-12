var v;
var dt = 0.1;
var points = [];

var zoom = 1;

function setup() {
    v = createVector(0,0);
}

function draw() {
    createCanvas(window.innerWidth,window.innerHeight);
    
    translate(width/2,height/2)
    scale(zoom)
    
    strokeWeight(1/zoom)
    
    //draw the vector
    ellipse(v.x,v.y,10/zoom,10/zoom)
    
    //line
    points.push(v.copy());
    for (var i = 0; i<points.length-1; i++) {
        var p = points[i]
        var q = points[i+1]
        line(p.x,p.y,q.x,q.y)
    }
    
    
    //iterate
    BE();
    
}

//RHS of the differential equation
function f(v) {
    return createVector(-v.y,v.x)
}

//Forward Euler
function FE() {
    v.add(f(v).mult(dt))
}

//Backward Euler
function BE() {
    var a = 1/(dt*dt+1)
    v = createVector(a*v.x-a*dt*v.y,a*dt*v.x+a*v.y);
}

//Trapezoidal method
function TZ() {
    var x = dt/2;
    v = createVector((1/(x*x+1)-x*x/(x*x+1))*v.x - 2*x/(x*x+1)*v.y,
                     2*x/(x*x+1)*v.x + (1/(x*x+1)-x*x/(x*x+1))*v.y)
    
}

function mousePressed() {
    points = []
    v = createVector((mouseX-width/2)/zoom,(mouseY-height/2)/zoom)
}

function mouseWheel(event) {
    if (event.delta > 0) zoom *= 1.1
    if (event.delta < 0) zoom /= 1.1
}
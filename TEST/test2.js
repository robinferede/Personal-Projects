var points = [];
var connection;
var counter = 0;
var path = [];

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
    connection = {p: createVector(width/2,height/2), v: createVector(0,0)}
}

function draw() {
    background(255)
    ellipse(mouseX,mouseY,10,10);
    
    for (var i = 0; i < points.length; i++) {
        ellipse(points[i].x,points[i].y,10,10);
    }
    
    stroke(255,0,0);
    ellipse(connection.p.x,connection.p.y,10,10);
    stroke(0);
    
    connect();
    connection.p.add(connection.v);
    //connection.v.mult(0.99);
    
    path.push(connection.p.copy());
    drawPath();
}

function mouseClicked() {
    points.push(createVector(mouseX,mouseY));
}

function connect() {    
    for (var i = 0; i < points.length; i++) {
        line(points[i].x,points[i].y,connection.p.x,connection.p.y)
    }
    
    var force = createVector(0,0);
    for (var i = 0; i < points.length; i++) {
        force.add(p5.Vector.sub(points[i],connection.p).normalize())
    }
    connection.v.add(force);
}

function drawPath() {
    for (var i = 1; i < path.length; i++) {
        stroke(255,0,0)
        line(path[i].x,path[i].y,path[i-1].x,path[i-1].y);
        stroke(0)
    }
    if (path.length > 1000) path.shift();
}
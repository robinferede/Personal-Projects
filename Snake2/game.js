var s;
var food = [];
var zoom = 1;

function setup() {
    createCanvas(window.innerWidth,window.innerHeight)
    s = new Snake();
    s.p = createVector(width/2,height/2)
    
    for (var i = 0; i < 100; i++) {
        food.push(createVector(random()*width,random()*height,10))
    }
    
    noStroke();
}

function draw() {
    background(50)
    translate(width/2-(zoom*s.p.x),height/2-(zoom*s.p.y));
    scale(zoom);
    
//    translate(width/2,height/2)
//    rotate(-Math.PI/2-angle)
//    translate(-width/2,-height/2)
    
    drawGrid();
    s.v.normalize();
    
    var min = Infinity;
    var best = food[0];
    for (var i = 0; i < food.length; i++) {
        var b = food[i];
        var d = dist(s.p.x,s.p.y,b.x,b.y);
        ellipse(b.x,b.y,b.z,b.z)
        if (d < s.d/2+food[i].z/2) {
            s.len += food[i].z/s.vabs;
            s.d += food[i].z/10;
            s.vabs += food[i].z/100
            food[i] = createVector(s.p.x+random(-1,1)*50*s.d,
                                   s.p.y+random(-1,1)*50*s.d,
                                   s.d)
        } else if (d < min) {
            min = d;
            best = food[i];
        }
    }
    
    var dir = createVector(best.x-s.p.x,best.y-s.p.y)
    dir.normalize();
    
    var error = p5.Vector.cross(s.v,dir);
    
//    if (error.z > 0) s.v.rotate(0.05);
//    if (error.z < 0) s.v.rotate(-0.05);
    
//    fill(0,255,0)
//    ellipse(best.x,best.y,10,10)
    
    s.v.normalize();
    s.v.mult(s.vabs);
    if (keyIsDown(RIGHT_ARROW)) s.v.rotate(0.05);
    if (keyIsDown(LEFT_ARROW))  s.v.rotate(-0.05);
    if (keyIsDown(32)) s.update();
    if (keyIsDown(SHIFT)) s.len ++;
    
    s.update();
    s.death();
    s.draw();
}

function mouseWheel(event) {
//    if (event.delta > 0 && zoom <= 10) zoom *= 1.1
//    if (event.delta < 0 && zoom >= 1/1000) zoom /= 1.1
    if (event.delta > 0) zoom *= 1.1
    if (event.delta < 0) zoom /= 1.1
}

function drawGrid() {
    var x = s.p.x;
    var y = s.p.y;
    
    stroke(60)
    var step = 50 * Math.pow(10,Math.floor(-Math.log10(zoom)+0.5))
    strokeWeight(step/100)
    for (var i = Math.floor(x - width/zoom); i < x + width/zoom; i++) {
        if (i % step == 0) line(i,y-height/zoom,i,y+height/zoom)
    }
    for (var i = Math.floor(y - height/zoom); i < y + height/zoom; i++) {
        if (i % step == 0) line(x-width/zoom,i,x+width/zoom,i)
    }
    strokeWeight(1)
    noStroke()
}
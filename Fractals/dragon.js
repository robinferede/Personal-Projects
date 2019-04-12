var lines = [];
var newlines = [];
var direction = 1;
var zoom = 1;
//var iterations = 2;

function setup() {
    createCanvas(1000,1000);
//    noLoop();
    
    var firstline = new Line();
    firstline.posa = createVector(width*0.3,height/2);
    firstline.posb = createVector(width*0.7,height/2);
    
    lines.push(firstline)
    
//    for (var i = 0; i < iterations; i++) {
//        iterate();
//    }
}

function draw() {
    background(0);
    strokeWeight(1/zoom);
    
    translate(width*0.3,height/2)
    scale(zoom);
    translate(-width*0.3,-height/2)
    
    for (var i = 0; i < lines.length; i++) {
        lines[i].show();
    }
}

function Line() {
    this.posa;
    this.posb;
    this.dir;
    
    this.iterate = function() {
        var diff = p5.Vector.sub(this.posb,this.posa);
        
        var p = p5.Vector.div(diff,4);
        
        //iets
        var pm = p5.Vector.div(diff,2);
            pm.add(this.posa);
        
        var p1 = p5.Vector.add(this.posa,p);
        var p2 = p5.Vector.add(p1,p.rotate(this.dir*-Math.PI/2))
        var p3 = p5.Vector.add(p2,p.rotate(this.dir*Math.PI/2))
        
        var p6 = p5.Vector.sub(this.posb,p);
        var pv = p5.Vector.sub(p6,p.rotate(this.dir*-Math.PI/2))
        var p4 = p5.Vector.sub(pv,p.rotate(this.dir*Math.PI/2))
        
        //dragon
        var pdragon = p5.Vector.div(diff,Math.sqrt(2));
            pdragon.rotate(this.dir*Math.PI/4)
            pdragon.add(this.posa)

        var points = [this.posa,pdragon,this.posb]
        
        for (var i = 1; i < points.length; i++) {
            var newline = new Line();
            newline.posa = points[i-1];
            newline.posb = points[i];
            newlines.push(newline);
        }
    }
    
    this.show = function() {
        stroke(255);
        line(this.posa.x,
             this.posa.y,
             this.posb.x,
             this.posb.y)
    }
}

function mousePressed() {
    direction *= 1 ;
    for (var i = 0; i < lines.length; i++) {
        if (i%2 == 0) {
            lines[i].dir = -direction;
        } else {
            lines[i].dir = direction;
        }
        lines[i].iterate();
    }
    lines = newlines;
    newlines = [];
}

function mouseWheel(event) {
    if (event.delta > 0) zoom *= 1.1
    if (event.delta < 0) zoom /= 1.1
}

function isPrime(n) {
    if (n == 1 || n == 2) {
        return true;
    } else {
        var answer;
        for (var i = 0; i*i <= n; i++) {
            answer = true
            if (n%i != 0) {
                answer = false;
                break
            }
        }
        return answer;
    }
}
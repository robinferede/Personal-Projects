var balls = []

function setup() {  
    createCanvas(window.innerWidth,window.innerHeight);
    noStroke()
    for (var i = 0; i < 100; i++) {
        var ball = {
            p: createVector(400*random(),400*random()),
            v: createVector(random(-1,1),random(-1,1)),
            r: 50*random()
        }
        balls.push(ball)
    }
}

function draw() {
    background(0)
    for (var i = 0; i < 100; i++) {
        fill(255)
        ellipse(balls[i].p.x,balls[i].p.y,balls[i].r,balls[i].r)
        
        balls[i].p.add(balls[i].v)
        balls[i].v.rotate(0.1*random(-1,1))
    }
}
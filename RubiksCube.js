var pos;
var ori;

var CAM;
var SOLID;
var ENV;

var start;
var oristart;

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
    
    pos = createVector(0,-700,0);
    ori = createVector(0,0,0);
    
    ENV = new Environment();
    
    CAM = new Camera();
    CAM.pos = pos.copy();
    CAM.mat = rotM(-ori.x,-ori.y,-ori.z);
    CAM.f = 500;

    CUBE = new RubiksCube();
    
    BIGBOY = new Cube(createVector(300,300,0))
    
    ENV.addSolid(CUBE);
}

function draw() {
    background(0);  
    translate(width/2,height/2);
    stroke(0);
    strokeWeight(1);
    
    if (['U','D','F','B','L','R'].includes(key)) CUBE.move(key);
    key = ''
    
//    if (!CUBE.animation) CUBE.move(['U','D','F','B','L','R'][floor(6*random())]);
    
    //update RubiksCube
    CUBE.update();
    
    //draw SOLIDS
    ENV.showFaces(CAM);
    
    //update camera
    CAM.mat = rotM(-ori.x,-ori.y,-ori.z);
    var p = CAM.pos;
    [p.x,p.y,p.z] = math.multiply(math.inv(CAM.mat),[pos.x,pos.y,pos.z])
}

function mousePressed() {
    start = [mouseX,mouseY];
    oristart = ori.copy();
}

function mouseDragged() {
    //update cube orientation
    ori.x = oristart.x+(start[1]-mouseY)*PI/height;
    ori.z = oristart.z+(start[0]-mouseX)*4*PI/width;
    
    if (ori.x > PI/2) ori.x= PI/2;
    if (ori.x <-PI/2) ori.x=-PI/2;
}

function rotM(a,b,c) {
    var M1=[[1,0,0],
            [0,math.cos(a),-math.sin(a)],[0,math.sin(a),math.cos(a)]];
    var M2=[[math.cos(b),0,math.sin(b)],
            [0,1,0],
            [-math.sin(b),0,math.cos(b)]];
    var M3=[[math.cos(c),-math.sin(c),0],
            [math.sin(c),math.cos(c),0],
            [0,0,1]];
    return math.multiply(M1,M2,M3)
}

function Face(vertices, color=[0,0,150]) {
    this.vertices = vertices;
    this.color = color;
}

function Solid() {
    this.center = createVector(0,0,0);
    this.vertices = [];
    this.edges = [];
    this.faces = [];
    
    this.translate = function(x,y,z) {
        this.vertices.forEach(function(v){
            v.x+=x;
            v.y+=y;
            v.z+=z;
        })
    }
    
    this.scale = function(lambda) {
        this.vertices.forEach(function(v){
            v.mult(lambda);
        })
    }
    
    this.rotate = function(a,b,c) {
        var p = this.center;
        var R = rotM(a,b,c);
        [p.x,p.y,p.z] = math.multiply(R,[p.x,p.y,p.z]);
        this.vertices.forEach(function(v){
            [v.x,v.y,v.z] = math.multiply(R,[v.x,v.y,v.z])
        })
    }
    
    this.copy = function() {
        var copy = new Solid();
        //copy vertices
        this.vertices.forEach(function(v){
            copy.vertices.push(v.copy());
        })
        //copy edges
        this.edges.forEach(function(e){
            copy.edges.push([
                copy.vertices[this.vertices.indexOf(e[0])],
                copy.vertices[this.vertices.indexOf(e[1])]
            ])
        },this)
        //copy faces
        this.faces.forEach(function(f){
            var faceVertices = [];
            var faceColor = f.color.slice();
            f.vertices.forEach(function(v){
                faceVertices.push(
                    copy.vertices[this.vertices.indexOf(v)]
                )
            },this)
            copy.faces.push(new Face(faceVertices,faceColor));
        },this)
        return copy;
    }
}

function Cube(center = createVector(0,0,0), size = 100, color=[0,0,150]) {
    Solid.call(this);
    this.size = size;
    this.center = center;
    
    this.vertices = [
        createVector(0,0,0),
        createVector(0,0,1),
        createVector(0,1,0),
        createVector(0,1,1),
        createVector(1,0,0),
        createVector(1,0,1),
        createVector(1,1,0),
        createVector(1,1,1)
    ];
    var v = this.vertices;
    this.edges = [
        [v[0b000],v[0b001]],
        [v[0b000],v[0b010]],
        [v[0b000],v[0b100]],
        [v[0b011],v[0b010]],
        [v[0b011],v[0b001]],
        [v[0b011],v[0b111]],
        [v[0b101],v[0b100]],
        [v[0b101],v[0b111]],
        [v[0b101],v[0b001]],
        [v[0b110],v[0b111]],
        [v[0b110],v[0b100]],
        [v[0b110],v[0b010]]  
    ];
    this.faces = [
        new Face([v[0b001],v[0b011],v[0b111],v[0b101]],color), //UP
        new Face([v[0b000],v[0b010],v[0b110],v[0b100]],color), //DOWN
        new Face([v[0b000],v[0b001],v[0b101],v[0b100]],color), //FRONT
        new Face([v[0b010],v[0b011],v[0b111],v[0b110]],color), //BACK
        new Face([v[0b000],v[0b001],v[0b011],v[0b010]],color), //LEFT
        new Face([v[0b100],v[0b101],v[0b111],v[0b110]],color)  //RIGHT
    ];    
    
    this.translate(-0.5,-0.5,-0.5);
    this.scale(size);
    this.translate(center.x,center.y,center.z);
}

function RubiksCube() {
    Solid.call(this);
    this.cubes = [];
    
    this.animation = false;
    this.moving = [];
    this.steps = 5;
    this.progress = 0;
    
    //adds cubes
    for (var i=-1; i<2; i++) {
        for (var j=-1; j<2; j++) {
            for (var k=-1; k<2; k++) {
                var cube = new Cube(
                    createVector(i*100,j*100,k*100),
                    100,
                    [50,50,50]
                );
                //faces order = UP DOWN FRONT BACK LEFT RIGHT
                //UP    =RED
                if (k== 1) cube.faces[0].color = [255,0,0]; 
                //DOWN  =ORANGE
                if (k==-1) cube.faces[1].color = [255,165,0];; 
                //FRONT =GREEN
                if (j==-1) cube.faces[2].color = [0,150,0]; 
                //BACK  =BLUE
                if (j== 1) cube.faces[3].color = [0,0,255];
                //LEFT  =YELLOW
                if (i==-1) cube.faces[4].color = [255,255,0]; 
                //RIGHT =WHITE
                if (i== 1) cube.faces[5].color = [255,255,255];
                
                this.cubes.push(cube);
            }
        }
    }
    
    this.cubes.forEach(function(cube){
        this.vertices.push(...cube.vertices);
        this.edges.push(...cube.edges);
        this.faces.push(...cube.faces);
    },this);
    
    this.move = function(layer) {
        this.moving.push(layer);
        this.animation = true;
    }
    
    this.update = function() {
        if (this.progress == this.steps) {
            this.progress = 0;
            this.moving.shift();
            if (this.moving.length == 0) {
                this.animation = false;
            }
        }  
        if (this.animation) {
            this.progress++;
            if (this.moving[0]=='U') {
                this.cubes.forEach(function(cube){
                    if (cube.center.z > 10) cube.rotate(0,0,PI/(2*this.steps));
                },this);
            }
            if (this.moving[0]=='D') {
                this.cubes.forEach(function(cube){
                    if (cube.center.z <-10) cube.rotate(0,0,PI/(2*this.steps));
                },this);
            }
            if (this.moving[0]=='F') {
                this.cubes.forEach(function(cube){
                    if (cube.center.y <-10) cube.rotate(0,PI/(2*this.steps),0);
                },this);
            }
            if (this.moving[0]=='B') {
                this.cubes.forEach(function(cube){
                    if (cube.center.y > 10) cube.rotate(0,PI/(2*this.steps),0);
                },this);
            }
            if (this.moving[0]=='L') {
                this.cubes.forEach(function(cube){
                    if (cube.center.x <-10) cube.rotate(PI/(2*this.steps),0,0);
                },this);
            }
            if (this.moving[0]=='R') {
                this.cubes.forEach(function(cube){
                    if (cube.center.x > 10) cube.rotate(PI/(2*this.steps),0,0);
                },this);
            }
        }
    }
}

function Environment() {
    //set of 3d points
    this.vertices = [];
    //set of connected vertices
    this.edges = [];
    //set of edges forming faces
    this.faces = [];
    
    this.addSolid = function(solid) {
        this.vertices.push(...solid.vertices);
        this.edges.push(...solid.edges);
        this.faces.push(...solid.faces);
    }
    
    this.showEdges = function(cam) {
        this.edges.forEach(function(edge){
            var p0 = cam.project(edge[0]);
            var p1 = cam.project(edge[1]);
            line(p0.x,p0.y,p1.x,p1.y);
        })
    }
    
    this.showFaces = function(cam) {
        this.orderFaces(cam);
        this.faces.forEach(function(f){
            fill(f.color);
            beginShape()
            f.vertices.forEach(function(p){
                var q = cam.project(p);
                vertex(q.x,q.y);
            })
            endShape(CLOSE)
        })
    }
    
    //sorting faces from background to forground
    this.orderFaces = function(cam) {
        var ordered = false
        while (!ordered) {
            ordered = true;
            for (var i=0; i<this.faces.length-1; i++) {
                var f1 = this.faces[i];
                var f2 = this.faces[i+1];
                if (this.facevalue(f1,cam)<this.facevalue(f2,cam)) {
                    this.faces[i]=f2;
                    this.faces[i+1]=f1;
                    ordered = false;
                }
            }
        }
    }
    
    //value used for sorting
    this.facevalue = function(face,cam) {
        var distances = [];
        face.vertices.forEach(function(v){
            distances.push(
                dist(v.x,v.y,v.z,cam.pos.x,cam.pos.y,cam.pos.z)
            );
        });
        return max(distances);
    }
}

function Camera() {
    this.pos;
    this.mat;
    this.f;
    this.project = function(point) {
        var p = [point.x-this.pos.x,
                 point.y-this.pos.y,
                 point.z-this.pos.z];
        p = math.multiply(this.mat,p);
        if (p[1]<0) p[1]=0;
        return createVector(p[0]*this.f/p[1],-p[2]*this.f/p[1]);
    }
}
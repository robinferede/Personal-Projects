function Snake() {
    this.p;
    this.v = createVector(0,1);
    this.vabs = 1;
    this.tail = [];
    this.d = 10;
    this.len = 100;
    this.color = color(255,0,0)
    
    this.draw = function() {
        fill(this.color)
        ellipse(this.p.x,this.p.y,this.d,this.d)
        for (var i = 0; i < this.tail.length; i++) {
            ellipse(this.tail[i].x,this.tail[i].y,this.d,this.d)
        }
    }
    
    this.update = function() {
        console.log(this.d,this.len);
        if (this.tail.length > this.len) {
            this.tail = this.tail.slice(1);
        }
        this.tail.push(this.p.copy());
        this.p.add(this.v)
    }
    
    this.death = function() {
        for (var i = 0; i < this.tail.length - 100; i++) {
            if (dist(this.p.x,this.p.y,this.tail[i].x,this.tail[i].y) < this.d) {
                this.tail = [];
                this.len = 100;
                this.d = 10;
                this.vabs = 1;
                
            }
        }
    }
}
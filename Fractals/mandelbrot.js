var x = -0.235125
var y = 0.827215
var r = 0.00004
var modulus = 0.2

var board = [];
var nextzoom = [];
var currentzoom = [[x-(16/9)*r,y-r],[x+(16/9)*r,y+r]];

function setup() {
    createCanvas(1600,900);
    initialize(currentzoom[0],currentzoom[1])
    noLoop();
}

function draw() {
    background(0);
    for (var y = 0; y < board.length; y++) {
        for (var x = 0; x < board[y].length; x++) {
            stroke(board[y][x]);
            point(x,y);
        }
    }
//    if (nextzoom.length == 2) {
//        initialize(nextzoom[0],nextzoom[1]);
//        currentzoom = nextzoom;
//        nextzoom = [];
//    }
}

function initialize(a,b) {
    board = [];
    for (var y = 0; y < height; y++) {
        var row = [];
        for (var x = 0; x < width; x++) {
            var ca = map(x,0,width,a[0],b[0]);
            var cb = map(y,0,height,a[1],b[1]);
            
            var za = 0;
            var zb = 0;
            
            var maxiter = 500;
            var value = 0;
            for (var i = 0; i < maxiter; i++) {
                var zanew = Repow(za,zb,2) + ca;
                var zbnew = Impow(za,zb,2) + cb;
                
                za = zanew;
                zb = zbnew;
                
                value++;
                
                if (za*za+zb*zb > 4) {
                    break;
                }
            }
            value = map(value,0,maxiter,0,1);
            value = value % 0.1
            value *= 5
            var brightness = map(value,0,1,0,255);
            row.push(brightness);
        }
        board.push(row);
    }
}

var f = [];
function factorial(n) {
  if (n == 0 || n == 1) return 1;
  if (f[n] > 0) return f[n];
  return f[n] = factorial(n-1) * n;
}

function binom(n,k){
    return factorial(n) / (factorial(n-k) * factorial(k));
}

function Repow(za,zb,n) {
    var sum = 0;
    for (var k = 0; k <= n; k += 2) {
        sum += binom(n,k) * Math.pow(za,n-k) * Math.pow(-1,k/2) * Math.pow(zb,k);
    }
    return sum;
}

function Impow(za,zb,n) {
    var sum = 0;
    for (var k = 1; k <= n; k += 2) {
        sum += binom(n,k) * Math.pow(za,n-k) * Math.pow(-1,(k-1)/2) * Math.pow(zb,k);
    }
    return sum;
}

function mousePressed() {
    var x = map(mouseX,0,width,currentzoom[0][0],currentzoom[1][0]);
    var y = map(mouseY,0,height,currentzoom[0][1],currentzoom[1][1]);
    nextzoom.push([x,y]);
}
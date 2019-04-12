function setup() {
    createCanvas(800,800)
    board = new Board();
    NN = new NeuralNetwork([9,9,9,9]);
}

function draw() {
    background(0)
    board.show();
    
    if (board.turn == -1) {
        board.move(computer(board));
        board.switchPlayer();
        board.winner();
    }
}


function Board() {
    this.matrix = [0,0,0,0,0,0,0,0,0]
    this.turn = -1;      // (1 -> X) , (-1 -> O)
    
    this.winpos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    this.winrow = []
    
    this.show = function() {
        strokeWeight(10)
        noFill()
        
        stroke(50)
        line(width*1/3,10,width*1/3,height-10)
        line(width*2/3,10,width*2/3,height-10)
        line(10,height*1/3,width-10,height*1/3)
        line(10,height*2/3,width-10,height*2/3)
        
        stroke(255)
        
        for (var i = 0; i < 9; i++) {
            if (this.matrix[i] != 0) {
                var x = (i%3)*width/3 + width/6
                var y = Math.floor(i/3)*height/3 + height/6
                if (this.matrix[i] == 1) {
                    if (this.winrow.includes(i)) stroke(255,0,0)
                    line(x-width/8,y-height/8,x+width/8,y+height/8)
                    line(x+width/8,y-height/8,x-width/8,y+height/8)
                    stroke(255)
                } else {
                    if (this.winrow.includes(i)) stroke(255,0,0)
                    ellipse(x,y,width/4,height/4)
                    stroke(255)
                }
            }
        }
    }
    
    this.move = function(move) {
        this.matrix[move] = this.turn
    }
    
    this.switchPlayer = function() {
        this.turn *= -1;
    }
    
    this.winner = function() {
        for (var i = 0; i < 8; i++) {
            if (this.matrix[this.winpos[i][0]] ==
                this.matrix[this.winpos[i][1]] &&
                this.matrix[this.winpos[i][1]] ==
                this.matrix[this.winpos[i][2]] &&
                this.matrix[this.winpos[i][2]] != 0) {
                this.winrow = this.winpos[i];
                return true
            }
        }
        return false
    }
    
    this.gameOver = function() {
        for (var i = 0; i < 9; i++) {
            if (this.matrix[i] == 0) return false
        }
        return true
    }
    
    this.possibleMoves = function() {
        var moves = []
        for (var i = 0; i < 9; i++) {
            if (this.matrix[i] == 0)
                moves.push(i)
        }
        return moves
    }
    
    this.copy = function() {
        var copy = new Board();
        copy.matrix = this.matrix.slice();
        copy.turn = this.turn;
        return copy
    }
    
    this.clear = function() {
        this.matrix = [0,0,0,0,0,0,0,0,0];
        this.winrow = [];
    }
}

function mouseClicked() {
    var move = Math.floor(mouseX/(width/3)) + 3*Math.floor(mouseY/(height/3))
    if (board.winner() || board.gameOver()) board.clear();
    else if (board.turn == 1 && 
             board.matrix[move] == 0) {
        board.move(move)
//        console.log(move+1)
        board.switchPlayer();
    }
}

function moveScores(boardObject) {
    var moves = boardObject.possibleMoves()
    var scores = Array(moves.length).fill(0)
        
    for (var i = 0; i < moves.length; i++) {
        var testBoard = boardObject.copy();
        testBoard.move(moves[i]);
        if (testBoard.winner()) {
            scores[i] = 1
            return scores;
        } else if (testBoard.gameOver()) {
            scores[i] = 0;
        } else {
            testBoard.switchPlayer();
            scores[i] = -max(moveScores(testBoard));
        }
    }
    return scores;
}

function computer(board) {
    var bestMoves = [];
    var moves = board.possibleMoves();
    var scores = moveScores(board);
    //console.log(scores);
    
    for (var i = 0; i < moves.length; i++) {
        if (scores[i] == max(scores)) {
            bestMoves.push(moves[i]);
        }
    }
    return getrandom(bestMoves);
}

function getrandom(array, probabilities) {
    if (probabilities) {
        var x = Math.random();
        for (var i=0; i<array.length; i++) {
            var p = probabilities[i];
            if (x<p) return array[i];
            else x-=p;
        }
    } else {
        var i = Math.floor(Math.random()*array.length);
        return array[i];
    }
}
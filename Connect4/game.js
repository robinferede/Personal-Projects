var scl = 100;
var player1 = 0;
var player2 = 1;
var white = 2;
var STEPS = 8;

function setup() {
    frameRate(10);
    
    board = new Board();
    board.cols = 7;
    board.rows = 6;    
    board.initialize();
    board.turn = player2;
    
    createCanvas(scl*board.cols,scl*board.rows);
}

function draw() {
    background(50);
    stroke(50);
    strokeWeight(5);
    grid();
    board.show();
    computer();
}

function Board() {
    this.cols;
    this.rows;
    this.players = [0,1];
    this.turn;
    
    this.restart = false;
    
    this.matrix = [];
    
    this.initialize = function() {
        for (var i = 0; i < this.cols; i++) {
            this.matrix[i] = [];
        }
    }
    
    this.show = function() {
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                var pos = this.matrix[i][j];
                if (pos == player1) fill(255,0  ,0  )
                if (pos == player2) fill(0  ,0  ,255)
                if (pos == white)   fill(255,255,255)
                stroke(50)
                strokeWeight(5);
                ellipse(i*scl+scl/2,(this.rows-1-j)*scl+scl/2,scl,scl);
            }
        }
    }
    
    this.move = function(move) {
        this.matrix[move].push(this.turn);
    }
    
    this.switchPlayer = function() {
        if (this.turn == this.players[0]) this.turn = this.players[1];
        else this.turn = this.players[0];
    }
    
    this.winner = function() {
        var winner = false;
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                var p = this.matrix;
                //horizontal --
                if (i+3 < p.length &&
                    p[i][j] == p[i+1][j] && 
                    p[i][j] == p[i+2][j] &&
                    p[i][j] == p[i+3][j]) {
                    
                    p[i][j]   = white;
                    p[i+1][j] = white;
                    p[i+2][j] = white;
                    p[i+3][j] = white;
                    winner = true;
                }
                
                //vertical |
                if (j+3 < p[i].length &&
                    p[i][j] == p[i][j+1] && 
                    p[i][j] == p[i][j+2] &&
                    p[i][j] == p[i][j+3]) {
                    
                    p[i][j]   = white;
                    p[i][j+1] = white;
                    p[i][j+2] = white;
                    p[i][j+3] = white;
                    winner = true;
                }
                
                //diagonal /
                if (i+3 < p.length &&
                    j+1 < p[i+1].length &&
                    j+2 < p[i+2].length &&
                    j+3 < p[i+3].length &&
                    p[i][j] == p[i+1][j+1] && 
                    p[i][j] == p[i+2][j+2] &&
                    p[i][j] == p[i+3][j+3]) {
                    
                    p[i][j]     = white;
                    p[i+1][j+1] = white;
                    p[i+2][j+2] = white;
                    p[i+3][j+3] = white;
                    winner = true;
                }
                
                //diagonal \
                if (i-3 >= 0  &&
                    j+1 < p[i-1].length &&
                    j+2 < p[i-2].length &&
                    j+3 < p[i-3].length &&
                    p[i][j] == p[i-1][j+1] && 
                    p[i][j] == p[i-2][j+2] &&
                    p[i][j] == p[i-3][j+3]) {
                    
                    p[i][j]     = white;
                    p[i-1][j+1] = white;
                    p[i-2][j+2] = white;
                    p[i-3][j+3] = white;
                    winner = true;
                }
            }
        }
        return winner;
    }
    
    this.combo3 = function(move) {
        var combo = 0;
        var ar = this.matrix[move];
        var len = this.matrix[move].length;
        
        //horizontal --
        var level = [];
        for (var i=0; i<7; i++) {
            if (this.matrix[move-3+i] == undefined) {
                level.push(2);
            } else level.push(this.matrix[move-3+i][len-1])
        }
        
        for (var i=0; i<4; i++) {
            var count = 0;
            for (var j=0; j<4; j++) {
                if (level[i+j] != ar[len-1] &&
                    level[i+j] != undefined) {
                    count = 0;
                    break;
                }
                else if (level[i+j] == ar[len-1]) count++
            }
            if (count==3) combo++;
        }
        
        //vertical |
        if (ar[len-1] == ar[len-2] && 
            ar[len-2] == ar[len-3]) {
            combo++;
        }
        
        //diagonal /
        var level = [];
        for (var i=0; i<7; i++) {
            if (this.matrix[move-3+i] == undefined ||
                len-4+i < 0 ||
                len-4+i > this.rows-1) {
                level.push(2);
            } else level.push(this.matrix[move-3+i][len-4+i])
        }
        
        for (var i=0; i<4; i++) {
            var count = 0;
            for (var j=0; j<4; j++) {
                if (level[i+j] != ar[len-1] &&
                    level[i+j] != undefined) {
                    count = 0;
                    break;
                }
                else if (level[i+j] == ar[len-1]) count++
            }
            if (count==3) combo++;
        }
        
        //diagonal \
        var level = [];
        for (var i=0; i<7; i++) {
            if (this.matrix[move-3+i] == undefined ||
                len+2-i < 0 ||
                len+2-i > this.rows-1) {
                level.push(2);
            } else level.push(this.matrix[move-3+i][len+2-i])
        }
        
        for (var i=0; i<4; i++) {
            var count = 0;
            for (var j=0; j<4; j++) {
                if (level[i+j] != ar[len-1] &&
                    level[i+j] != undefined) {
                    count = 0;
                    break;
                }
                else if (level[i+j] == ar[len-1]) count++
            }
            if (count==3) combo++;
        }
        
        return combo;
    }
    
    this.gameOver = function() {
        var ans = true
        for (var i = 0; i < board.cols; i++) {
            if (this.possible(i)) ans = false;
        }
        return ans;
    }
    
    this.possible = function(move) {
        if (move >= 0 && 
            move < this.cols &&
            this.matrix[move].length < this.rows) {
            return true;
        } else return false;
    }
    
    this.possibleMoves = function() {
        var moves = []
        for (var i = 0; i < this.cols; i++) {
            if (this.possible(i)) moves.push(i);
        }
        return moves;
    }
    
    this.copy = function() {
        var copy = new Board();
        copy.cols = this.cols;
        copy.rows = this.rows;
        copy.turn = this.turn;
        copy.initialize();
        
        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                copy.matrix[i].push(this.matrix[i][j]);
            }
        }
        return copy;        
    }
    
    this.symmetric = function() {
        for (var i = 0; i < Math.floor(this.cols/2); i++) {
            if (this.matrix[i].length != 
                this.matrix[this.cols-1-i].length) return false;
        }
        for (var i = 0; i < Math.floor(this.cols/2); i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
               if (this.matrix[i][j] != 
                   this.matrix[this.cols-1-i][j]) return false;
            }
        }
        return true;
    }
}

function mousePressed() {
    if (board.winner()||board.gameOver()) {
        board.initialize();
    }
    else if (board.turn == player1) {
        var move = Math.floor(mouseX/scl);
        if (board.possible(move)) {
            board.move(move);
            board.show();
            board.winner();
            board.switchPlayer();
        }
    }
}

function touchMove(moveX) {
    if (board.winner()||board.gameOver()) {
        board.initialize();
    }
    else if (board.turn == player1) {
        var move = Math.floor(moveX/scl);
        if (board.possible(move)) {
            board.move(move);
            board.show();
            board.winner();
            board.switchPlayer();
        }
    }
}

function moveScores(boardObject, steps) {
    steps--;
    var moves = boardObject.possibleMoves();
    
    //checking symmetry and removing redundancy
    if (board.symmetric()) {
        var keep = Math.floor(moves.length/2)
        //choosing random side
        moves.splice(0,keep);        
    }
    
    var scores = Array(moves.length).fill(0);
    
    //first check winning possibilities 
    var win = false;
    for (var i = 0; i < moves.length; i++) {
        var testBoard = boardObject.copy();
        testBoard.move(moves[i]);
        if (testBoard.winner()) {
            scores[i] = steps;
            win = true;
            break;            
        }
    }
    
    if (!win) {
        for (var i = 0; i < moves.length; i++) {
            var testBoard = boardObject.copy();
            testBoard.move(moves[i]);
            //combo3 heuristic
            scores[i] += steps*testBoard.combo3(moves[i])/100;
            if (steps > 0) {
                testBoard.switchPlayer();
                scores[i] += -max(moveScores(testBoard,steps));
                if (scores[i]>0) break;
            }
        }
    }
    return scores;    
}

//NOTINUSE vvvvv
function miniMax(boardObject, steps) {
    if (boardObject.winner()) return 1;
    else if (steps > 0){
        var bestScore = -1
        for (var i = 0; i<boardObject.cols; i++) {
            if (boardObject.possible(i)) {
                var testBoard = boardObject.copy();
                testBoard.move(i);
                testBoard.switchPlayer();
                var score = -miniMax(testBoard,steps-1);
                if (score>0) return score;
                else if (score>bestScore) bestScore=score;
            }
        }
        return bestScore;
    }
    return 0;
}
//NOTINUSE ^^^^^

function computer() {
    if (board.turn == player2 &&
        !board.winner() &&
        !board.gameOver()) {
        var bestMoves = [];
        var moves = board.possibleMoves();
        var scores = moveScores(board,STEPS);
        console.log(scores);
        
        //middle heuristic
        if (max(scores) == 0) {
            for (var i = 0; i < moves.length; i++) {
                scores[i] = -Math.abs(moves[i]-3);
            }
        }
        
        for (var i = 0; i < moves.length; i++) {
            if (scores[i] == max(scores)) {
                bestMoves.push(moves[i]);
            }
        }
        board.move(getrandom(bestMoves));
        board.show();
        board.winner();
        board.switchPlayer();
        
    }
}

function grid() {
    for (var i = 0; i < board.cols; i++) {
        for (var j = 0; j < board.rows; j++) {
            fill(0)
            ellipse(i*scl+scl/2,j*scl+scl/2,scl,scl);
        }
    }
}

function getrandom(array) {
    var i = Math.floor(Math.random()*array.length);
    return array[i];
}
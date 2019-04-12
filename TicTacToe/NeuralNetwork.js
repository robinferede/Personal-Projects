function NeuralNetwork(layers) {
    //number of neurons in each layer
    this.layers = layers;
    //number of layers (excluding the inputlayer)
    this.n = this.layers.length-1;
        
    //initialize weights and biases between all layers
    this.W = [];
    this.b = [];
    
    for (var i=0; i<this.n; i++) {
        this.W.push(math.zeros([this.layers[i],
                                 this.layers[i+1]]));
        this.b.push(math.zeros([1,
                                 this.layers[i+1]]));
    }
    
    //forward propagate inputs through network
    this.forward = function(X) {
        var ones = math.ones([math.size(X)[0],1]);
        this.a = [X];   //activity in each layer
        this.z = [X];   //input sum
        Yhat = X;
        
        for (var i=0; i<this.n; i++) {
            //ones are appended to the input functioning as bias nodes
            var z = math.multiply(
                math.concat(Yhat,ones),
                math.concat(this.W[i],this.b[i],0)            
            );
            
            //last layer uses softmax
            if (i<this.n-1) Yhat = this.sigmoid(z);
            else Yhat = this.softmax(z);
            
            this.z.push(z);
            this.a.push(Yhat);
        }
        return Yhat;
    }
    
    //activation function
    this.sigmoid = function(z) {
        var bottom = math.add(1, math.exp(math.multiply(-1, z)));
        return math.dotDivide(1, bottom);
    }
    
    //derivative of the activation function
    this.sigmoidPrime = function(z) {
        var top = math.exp(math.multiply(-1, z));
        var bottom = math.square(math.add(1, math.exp(math.multiply(-1, z))));
        return math.dotDivide(top, bottom);
    }
    
    //softmax
    this.softmax = function(z) {
        var top = math.exp(math.subtract(z,math.max(z)));
        var bottom = math.diag(top.map(x=>1/math.sum(x)))
        return math.multiply(bottom,top);
    }
    
    //costfunction (cross entropy)
    this.costFunction = function(X,Y) {
        var Yhat = this.forward(X);
        return -math.sum(math.dotMultiply(Y,math.log(Yhat)));
    }
    
    //gradient of the cost function wrt to weights and biases (backpropagation)
    this.gradient = function(X,Y) {
        var dW = [];
        var db = [];
        
        var ones = math.ones([math.size(X)[0],1]);
        var delta = math.subtract(this.forward(X), Y);
        
        dW[this.n-1] = math.multiply(math.transpose(this.a[this.n-1]), delta);
        db[this.n-1] = math.multiply(math.transpose(ones), delta);
        
        for (var i=this.n-1; i>0; i--) {
            delta = math.dotMultiply(math.multiply(delta, math.transpose(this.W[i])), this.sigmoidPrime(this.z[i]));
            dW[i-1] = math.multiply(math.transpose(this.a[i-1]),delta);
            db[i-1] = math.multiply(math.transpose(ones),delta);
        }
        return [dW,db];
    }
    
    //grad descent step with stepsize gamma
    this.gradstep = function(dW,db,gamma) {
        for (var i=0; i<this.n; i++) {
            this.W[i]=math.add(this.W[i],math.multiply(-gamma,dW[i]));
            this.b[i]=math.add(this.b[i],math.multiply(-gamma,db[i]));
        }
        return this.costFunction(X,Y);
    }
    
    //grad descent with backtracking linesearch, returns new cost
    this.train = function(X,Y, {alpha=1, c=0.5, tau=0.5, iterations=100, showprogress=false}={}) {
        for (var i=0; i<iterations; i++) {
            //search direction
            var [dW,db] = this.gradient(X,Y);

            //local slope along the search direction
            var m = math.sqrt(math.sum(dW.concat(db).map(
                x => math.sum(math.square(x)))));

            var oldcost = this.costFunction(X,Y);        
            var newcost = this.gradstep(dW,db,alpha/m);

            while (oldcost-newcost < alpha*c*m) {
                newcost = this.gradstep(dW,db,(-alpha+tau*alpha)/m);
                alpha = tau*alpha;
            }
            if (showprogress) console.log(newcost);
        }
        return this.costFunction(X,Y);
    }
}
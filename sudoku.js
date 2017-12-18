var SudokuSolving = function(grid) {
    
    this.digits   = '123456789';
    this.rows     = 'ABCDEFGHI';
    this.cols     = this.digits;
    this.squares  = this.cross(this.rows, this.cols);
    this.unitlist = this.generateUnitlist();
    this.values   = {};
    this.gridValues = {};
    
    this.initBoardValues();
    
    this.checkGrid(grid);

};

SudokuSolving.prototype.checkGrid = function(grid){
    if(grid.length === 0 || grid.length !== 81){
        throw new Error("Not a valid grid");
    }

    let gridArray;
    if(grid instanceof Array){
        gridArray = grid;
    } else {
        gridArray = grid.split("");
    }
    
    this.initGridValues(gridArray);
}

SudokuSolving.prototype.cross = function(A,B){
   let cross = [];
    for(let i=0; i < A.length; i++){
         for(let j=0; j < B.length; j++){
             cross.push(A[i]+B[j]);
         }
    }
    return cross; 
}
/**
* Generates list of all Units
* @return {Array}
*/
SudokuSolving.prototype.generateUnitlist = function(){

    let colsArrays = [],
        rowsArrays = [],
        regionsArrays = [],
        unitlist = [];

    for(let i=0; i < this.cols.length; i++){
        colsArrays.push(this.cross(this.rows,this.cols[i]))
    }

    for(let i=0; i < this.rows.length; i++){
        rowsArrays.push(this.cross(this.rows[i],this.cols))
    }

    let regionsRowsIndex = ['ABC','DEF','GHI'];
    let regionsColsIndex = ['123','456','789'];

    for(let i=0; i < 3; i++){
        for(let j=0; j < 3; j++){
            regionsArrays.push(this.cross(regionsRowsIndex[i],regionsColsIndex[j]))
        }
    }
    unitlist = colsArrays;
    unitlist = unitlist.concat(rowsArrays);
    unitlist = unitlist.concat(regionsArrays);

    return unitlist;

}

/**
* Main function to start the solving process.
* Sudoku grid can be either String or Array of 81 numbers
* @param {String | Array} grid 
* @return {String | Array} solution
*/
SudokuSolving.prototype.parseGrid = function(){
        var self = this;
    
        //var size = Object.keys(this.values).length;

        self.squares.forEach(function(square){
            if(self.digits.indexOf(self.gridValues[square]) !== -1){
                self.assign(square, self.gridValues[square]);
            }
        })

        if(this.isBoardSolved()) return true;
        
        if(this.search()) return true;
    
    return false;
}

/**
* Use inital grid values and assign them to squares.
* @return {Array}
*/
SudokuSolving.prototype.initGridValues = function(gridArray){
    var self = this;

    self.squares.forEach(function(square,index){
        self.gridValues[square] = gridArray[index]
    })
}

SudokuSolving.prototype.initBoardValues = function(){
    var self = this;

    self.squares.forEach(function(square){
        self.values[square] = self.digits
    })
}


SudokuSolving.prototype.isBoardSolved = function(){
    var self = this;
    let success = [];
    self.squares.forEach(function(square){
        
        if(self.values[square].length !== 1){
            success.push("false")
        };
    })

    if(success.includes("false")){
        return false;
    }
    return true; 
}

/**
* Get the 3 unit arrays for square with 9 fields each
* @param {String} s Name of Square e.g. "A1"
* @return Array
*/
SudokuSolving.prototype.getUnitsOfSquare = function(square){
    let unitsOfSquare = [];
    this.unitlist.forEach(function(unit){
        if(unit.includes(square)){
            unitsOfSquare.push(unit);
        }
    })
    return unitsOfSquare;
}

/**
* Get the 20 peer squares for square
* @param {String} s Name of Square e.g. "A1"
* @return Array
*/
SudokuSolving.prototype.getPeersOfSquare = function(square){
    let unitsOfSquare = this.getUnitsOfSquare(square);

    let peersOfSquare = [];
    unitsOfSquare.forEach(function(unit){
        unit.forEach(function(el){
            if(!peersOfSquare.includes(el) && el != square){
                peersOfSquare.push(el);
            }
        })

    })
    return peersOfSquare;
}

/**
* Assign one number - which is the solution for a field - to the field
* @param {String} s Name of Square e.g. "A1"
* @param {Number} digit Number
* @param {squareIndex} digit Number
*/
SudokuSolving.prototype.assign = function(square, digit, DEBUG = false){

    var self = this;    
    // this is important. the temporary variable are all other digits, except the one we are looking for
    var other_values = self.values[square].replace(digit,'');
 
    let success = []
    for(let i=0; i < other_values.length; i++){
        success.push(self.eliminate(square,other_values[i],DEBUG));
    }
   
    // if all(eliminate(values, s, d2) for d2 in other_values):
    if(success.every(function(val){
        return val !== false;
    })){ 
        return true;
    } else {
        return false;
    }

    return true;
}

/**
* Delete all numbers from square except the solution. digit is exactly one number
* @param {String} s Name of Square e.g. "A1"
* @param {Number} digit Number
* @param {squareIndex} digit Number
* @return {Bool}
*/
SudokuSolving.prototype.eliminate = function(square, digit, DEBUG = false){
    var self = this; 
    
    if(DEBUG === true){
        console.log(square+" "+digit);
    }
    
    if(self.values[square].indexOf(digit) == -1){
        return true;
    }

    self.values[square] = self.values[square].replace(digit,'');
    
    

    if(self.values[square].length === 0){
        return false;
    }

    if(self.values[square].length === 1){
        let d2 = self.values[square];
        let peers = self.getPeersOfSquare(square);

        let success = []
        
        peers.forEach(function(peer){
            success.push(self.eliminate(peer, d2));
        })

        // if not all(eliminate(values, s2, d2) for s2 in peers[s]):
        if(!success.every(function(val){
            return val !== false;
        })){ 
            return false;
        }

        return true;
    }
    
    /**
    * Now iterate through all units of the square. Delete the digit from them
    */
    let unitsOfSquare = self.getUnitsOfSquare(square);
    var dplaces = [];
    unitsOfSquare.forEach(function(unit){
        dplaces = [];
        unit.forEach(function(unitSquare){
            if(self.values[unitSquare].indexOf(digit) !== -1){
                dplaces.push(unitSquare);
            }
        })
        // only one possible solution
        if(dplaces.length === 1){
            self.assign(dplaces[0], digit);
        }
    })

    return true;
}


SudokuSolving.prototype.search = function(values){
    var self = this;
    if(self.isBoardSolved()) return true;

    var smallestElArray =  self.getElWithMinValueOfUnsolvedBoard();

    // before we modified the original values. from here on we try different solutions
    // if they return false, we start again with the state of the board before the guessing

    // board is an object. Array.slice() will not work here
    var boardBeforeTrying = JSON.parse(JSON.stringify(self.values));
    
    let assignReturn;
    let success = [];
    

    for(let i = 0; i < smallestElArray[1].length; i++){
        
        assignReturn = self.assign(smallestElArray[0],smallestElArray[1][i], true);
        success.push( assignReturn );
        
        if(assignReturn === false){
            // Resetting board to the state before we tried out
            self.values = JSON.parse(JSON.stringify(boardBeforeTrying));
        } else {
            return true;
        }
    }

    return false;
}

 /**
* Helper for search to get the field with the smallest possible solutions.
*/
SudokuSolving.prototype.getElWithMinValueOfUnsolvedBoard = function(){
        var self = this;
        let smallest = 0;
        let smallestEl;
    
        self.squares.forEach(function(square){
    
            let value = self.values[square];
            let len = value.length;
            
            // if value is down to one digit, it is already solved
            if(len > 1){
                if(smallest === 0){
                    smallest = len;
                    smallestElArray = [square, value];
                } else if(len < smallest){
                    smallest = len;
                    smallestElArray = [square, value];
                }
            }
        })
        return smallestElArray;
    }


SudokuSolving.prototype.solve = function(){
    var self = this;
    if(self.parseGrid()){
        return self.valuesToString();
    }
    return false;
}

SudokuSolving.prototype.valuesToString = function(){
    var self = this;
    let valuesString = "";
    self.squares.forEach(function(square){
        valuesString += self.values[square];
    })
    return valuesString;
}

module.exports = SudokuSolving
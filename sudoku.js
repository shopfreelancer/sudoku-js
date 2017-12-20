var SudokuSolving = function(grid) {
    
    this.digits   = '123456789';
    this.rows     = 'ABCDEFGHI';
    this.cols     = this.digits;
    this.squares  = this.cross(this.rows, this.cols);
    this.unitlist = this.generateUnitlist();
    this.values   = {};
    this.gridValues = {};
    this.excludeFromSmallestSearch = [];
    
    this.initBoardValues();
    this.checkGrid(grid);

};

/**
* Main function to be called to solve a grid
* @return {Bool|String}  
*/
SudokuSolving.prototype.solve = function(){
    var self = this;
    if(self.parseGrid() === true){
        return self.valuesToString();
    }
    return false;
}

/**
* Validates input grid and inits the gridValues  
*/
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

        self.squares.forEach(function(square){
            if(self.digits.indexOf(self.gridValues[square]) !== -1){
                self.assign(square, self.gridValues[square]);
            }
        })

        if(this.isBoardSolved()) return true;
        
        // We need one clone of the values before the search process starts
        // until here there are only correct values
        self.boardBeforeTrying = JSON.parse(JSON.stringify(self.values));
        
        while (true){
            if(self.search() === true) break; 
        }
    
    return true;
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

/**
* Set values for squares
*/
SudokuSolving.prototype.initBoardValues = function(){
    var self = this;

    self.squares.forEach(function(square){
        self.values[square] = self.digits
    })
}

/**
* Helper to check if board is solved. Every square is one solution
*/
SudokuSolving.prototype.isBoardSolved = function(){
    var self = this;
    let success = [];
    self.squares.forEach(function(square){
        
        if(self.values[square].length !== 1){
            success.push(false)
        };
    })

    if(success.includes(false)){
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
SudokuSolving.prototype.assign = function(square, digit){
    var self = this; 

    var other_values = self.values[square].replace(digit,'');
    
    let success = []
    for(let i=0; i < other_values.length; i++){
        success.push(self.eliminate(square,other_values[i]));
    }
    
    // if all(eliminate(values, s, d2) for d2 in other_values):
    if(success.every(function(val){
        return val === true;
    })){ 
        return true;
    } else {
        return false;
    }
}

/**
* Delete all numbers from square except the solution. digit is exactly one number
* @param {String} s Name of Square e.g. "A1"
* @param {Number} digit Number
* @param {squareIndex} digit Number
* @return {Bool}
*/
SudokuSolving.prototype.eliminate = function(square, digit){
    var self = this; 
    
    //    if d not in values[s]:
    //    return values ## Already eliminated
    if(self.values[square].indexOf(digit) === -1){
        return true;
    }

    // my add one to prevent empty values
    if(self.values[square].length === 0){
        //return false;
    }
    
    self.values[square] = self.values[square].replace(digit,'');
    

    // ## (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
    // if len(values[s]) == 0:
    //    return False
    if(self.values[square].length === 0){
        return false;
    }
    
    //elif len(values[s]) == 1:
    //    d2 = values[s]
    if(self.values[square].length == 1){
        let d2 = self.values[square];
        let peers = self.getPeersOfSquare(square);

        let success = []
        
        peers.forEach(function(peer){
            success.push(self.eliminate(peer, d2));
        })

        // if not all(eliminate(values, s2, d2) for s2 in peers[s]):
        if(!success.every(function(val){
            return val === true;
        })){ 
            return false;
        }
    }
    
    //Now iterate through all units of the square. Delete the digit from them
    let unitsOfSquare = self.getUnitsOfSquare(square);
    var dplaces = [];
    unitsOfSquare.forEach(function(unit){
        dplaces = [];
        unit.forEach(function(unitSquare){

            if(self.values[unitSquare].indexOf(digit) > -1){
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

/**
* Search function if grid can´t be solved by assigning
*/
SudokuSolving.prototype.search = function(){
    var self = this;
    if(self.isBoardSolved()) return true;

    // before we modified the original values. from here on we try different solutions
    // if they return false, we start again with the state of the board before the guessing
    self.values = JSON.parse(JSON.stringify(self.boardBeforeTrying));
    var smallestElArray =  self.getElWithMinValueOfUnsolvedBoard();
 
    let assignReturn;
    let success = [];
    
    for(let i = 0; i < smallestElArray[1].length; i++){
        
        assignReturn = self.assign(smallestElArray[0],smallestElArray[1][i], true);
        success.push( assignReturn );
        if(assignReturn === false){
            // Resetting board to the state before we tried out
            self.values = JSON.parse(JSON.stringify(self.boardBeforeTrying));
        }
    }

    if(self.isBoardSolved()) return true;
        
    self.excludeFromSmallestSearch.push(smallestElArray[0]);
    
    return false;
}

 /**
* Helper for search to get the field with the smallest possible solutions.
*/
SudokuSolving.prototype.getElWithMinValueOfUnsolvedBoard = function(){
        var self = this;
        let smallest = 0;
        let smallestElArray = false;
    
        self.squares.forEach(function(square){
            
            let value = self.values[square];
            let len = value.length;
            
            // if value is down to one digit, it is already solved
            if(len > 1 && !self.excludeFromSmallestSearch.includes(square)){
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

/**
* Parses all values to single string
* @return {String}
*/
SudokuSolving.prototype.valuesToString = function(){
    var self = this;
    let valuesString = "";
    self.squares.forEach(function(square){
        valuesString += self.values[square];
    })
    return valuesString;
}

module.exports = SudokuSolving
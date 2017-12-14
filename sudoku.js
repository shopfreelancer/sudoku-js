module.exports.SudokuSolving = (function () {
    
    const digits   = '123456789';
    const rows     = 'ABCDEFGHI';
    const cols     = digits;
    const squares  = cross(rows, cols);

    var unitlist = generateUnitlist();

    var board = squares.map(function(square,index){
        let field = {
            name : square,
            value : digits,
            key : index
        };
        return field;
    });

    /**
    * Main function to start the solving process.
    * Sudoku grid can be either String or Array of 81 numbers
    * @param {String | Array} grid 
    * @return {String | Array} solution
    */
    function solveGrid(grid){
        let gridArray = [];
        
        if(!isGridValid(grid)){
            throw new Error("Not a valid grid");
        }

        if(grid instanceof Array){
            gridArray = grid;
        } else {
            gridArray = grid.split("");
        }

        // this is where we start. the board with 81 fields and the puzzle with the values from the grid variable
        let gridValues = mapGridToSquares(gridArray);

        // map grid values to the real board
        gridValues.forEach(function(gridItem,index){
            if(gridItem.value > 0){
                assign(gridItem.name, gridItem.value,index);
            }
        })
        
        if(grid instanceof Array){
            return parseBoardToArray();
        } else {
            return parseBoardToString();
        }
    } 
    
    /**
    * Simple helper function if grid string contains 81 numbers
    * @param {String | Array} grid 
    * @return {Bool}   
    */
    function isGridValid(grid){
        if(grid.length === 0 || grid.length !== squares.length){
            return false;
        }
        return true;
        
    }

    /**
    * Helper function. Cross product of 2 arrays or strings
    * @param {String | Array} grid
    * @return Array
    */
    function cross(A,B){
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
    function generateUnitlist(){

        var colsArrays = [],
            rowsArrays = [],
            regionsArrays = [],
            unitlist = [];

        for(let i=0; i < cols.length; i++){
            colsArrays.push(cross(rows,cols[i]))
        }

        for(let i=0; i < rows.length; i++){
            rowsArrays.push(cross(rows[i],cols))
        }

        let regionsRowsIndex = ['ABC','DEF','GHI'];
        let regionsColsIndex = ['123','456','789'];

        for(let i=0; i < 3; i++){
            for(let j=0; j < 3; j++){
                regionsArrays.push(cross(regionsRowsIndex[i],regionsColsIndex[j]))
            }
        }
        unitlist = colsArrays;
        unitlist = unitlist.concat(rowsArrays);
        unitlist = unitlist.concat(regionsArrays);

        return unitlist;

    }

    /**
    * Get the 3 unit arrays for square
    * @param {String} s Name of Square e.g. "A1"
    * @return Array
    */
    function getUnitsOfSquare(s){
        let unitsOfSquare = [];
        unitlist.forEach(function(unit){
            if(unit.includes(s)){
                let unitWithModel = [];
                unit.forEach(function(unitItem){
                    unitWithModel.push(getModelForSquareName(unitItem));
                })
                unitsOfSquare.push(unitWithModel);
               }
        })
        return unitsOfSquare;
    }

    /** 
    * Every field has 20 peers. Its units minus duplicate squares and the field itself
    * @param {String} s Name of Square e.g. "A1"
    * @return Array
    */
    function getPeersOfSquare(s){
        let units = getUnitsOfSquare(s);
        let peers = [];
        units.forEach(function(unit){
            unit.forEach(function(el){
                if(!peers.includes(el) && el.name !== s){
                   peers.push(el);
                }
            })
        })
        return peers;
    }

    /**
    * Take board array with all 81 square models and parse their values to string.
    * Like the inital grid string we started with
    * @return {String}
    */
    function parseBoardToString(){
        let boardString = '';

        board.forEach(function(square){
            boardString += square.value;
        });

        return boardString;
    }
    
    /**
    * Take board array with all 81 square models and parse their values to array.
    * Like the inital grid string we started with
    * @return {Array}
    */
    function parseBoardToArray(){
        let boardArray = [];

        board.forEach(function(square){
            boardArray.push(parseInt(square.value));
        });

        return boardArray;
    }

    /**
    * Use inital grid values and assign them to squares.
    * @return {Array}
    */
    function mapGridToSquares(gridArray){
        var gridValues = squares.map(function(square,index){
            let squareModel = {
                name : square,
                value : gridArray[index],
                key : index
            };
            return squareModel;
        });
        return gridValues;
    }

    /**
    * Assign one number - which is the solution for a field - to the field
    * @param {String} s Name of Square e.g. "A1"
    * @param {Number} digit Number
    * @param {squareIndex} digit Number
    */
    function assign(square, digit, squareIndex){

        // this is important. the temporary variable are all other digits, except the one we are looking for
        var other_values = board[squareIndex].value.replace(digit,'');

        for(let i=0; i<other_values.length; i++){
            eliminate(square,other_values[i],squareIndex)
        }
    }

    /**
    * Delete all numbers from square except the solution. digit is exactly one number
    * @param {String} s Name of Square e.g. "A1"
    * @param {Number} digit Number
    * @param {squareIndex} digit Number
    * @return {Bool}
    */
    function eliminate(square, digit, squareIndex){

        if(board[squareIndex].value.indexOf(digit) === -1){
            return;
        }

        board[squareIndex].value = board[squareIndex].value.replace(digit,'');

        if(board[squareIndex].value.length === 1){
            let d2 = board[squareIndex].value;
            let peers = getPeersOfSquare(square);

            peers.forEach(function(peer){
                eliminate(peer.name, d2, peer.key);
            })
            return false;
        }

        /**
        * Now iterate through all units of the square. Delete the digit from them
        */
        let unitsOfSquare = getUnitsOfSquare(square);
        var dplaces = [];
        unitsOfSquare.forEach(function(unit){
            dplaces = [];
            unit.forEach(function(unitSquare){
                if(unitSquare.value.indexOf(digit) !== -1){
                    dplaces.push(unitSquare);
                }
            })
            // only one possible solution
            if(dplaces.length === 1){
                assign(dplaces[0].name, digit, dplaces[0].key);
            }
        })

        return;

    }
    
    /**
    * Helper to get the whole model of square for one squareName e.g. "A1"
    * @param {String} s Name of Square e.g. "A1"
    * @return {Object} foundSquareObj
    */
    function getModelForSquareName(squareName){
        var foundSquareObj = ""
        board.every(function(square){
            if(square.name === squareName){
                foundSquareObj = square
                return false;
            }
            return true;
        })
        return foundSquareObj; 
    }
    
    /**
    * Revealing module pattern. public access for method parseGrid
    */
    return {
        solveGrid : solveGrid
    };
})();
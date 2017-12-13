var digits   = '123456789';
var rows     = 'ABCDEFGHI';
var cols     = digits;
var squares  = cross(rows, cols);

var grid = '030050040008010500460000012070502080000603000040109030250000098001020600080060020';

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
* Cross product of 2 arrays or strings
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

// get the 3 unit arrays for square s
function getUnitsOfSquare(s){
    unitsOfSquare = [];
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

// Each field has 20 peers. Its units minus duplicate squares and the field itself
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

function parseGrid(grid){
    // this is the whole board we try to get the solution for. values are 12...9 yet
    var values = squares.map(function(square){
        let pair = {
            name : square,
            value : digits,
        };
        return pair;
    })
    // this is where we start. the board with 81 fields and the puzzle with the values from the grid variable
    let gridValues = mapGridToSquares(grid);
    
    // map grid values to the real board
    gridValues.forEach(function(gridItem,index){
        if(gridItem.value > 0){
            assign(values, gridItem.name, gridItem.value,index);
        }
    })
}


function mapGridToSquares(grid){
    var gridValues = squares.map(function(square,index){
        let pair = {
            name : square,
            value : grid[index],
            key : index
        };
        return pair;
    });
    return gridValues;
}

/**
* assign one number - which is the solution for a field - to the field
* then call
*/
function assign(values, square, digit, squareIndex){
    
    // this is important. the temporary variable are all other digits, except the one we are looking for
    var other_values = board[squareIndex].value.replace(digit,'');

    for(let i=0; i<other_values.length; i++){
        eliminate(values,square,other_values[i],squareIndex)
    }
    /**
       if all(eliminate(values, s, d2) for d2 in other_values):
        return values
    else:
        return False
    */
    return values;
}

/**
* delete all numbers except the 
*/
function eliminate(values, square, digit, squareIndex){

    /**
         if d not in values[s]:
        return values ## Already eliminated
    */
    if(board[squareIndex].value.indexOf(digit) === -1){
        return values;
    }
    
    // values[s] = values[s].replace(d,'')
    board[squareIndex].value = board[squareIndex].value.replace(digit,'');

    
    //console.log("after "+board[squareIndex].value);
    /**
     """Eliminate d from values[s]; propagate when values or places <= 2.
    Return values, except return False if a contradiction is detected."""
    print("elim "+s+" s "+d+" d "+values[s])
    if d not in values[s]:
        return values ## Already eliminated
    values[s] = values[s].replace(d,'')
    ## (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
    if len(values[s]) == 0:
        return False
    ## Contradiction: removed last value
    elif len(values[s]) == 1:
        d2 = values[s]
        if not all(eliminate(values, s2, d2) for s2 in peers[s]):
            return False
    */
    
    if(board[squareIndex].value.length === 1){
        let d2 = board[squareIndex].value;
        peers = getPeersOfSquare(square);
        
        peers.forEach(function(peer){
            eliminate(values, peer.name, d2, peer.key);
        })
        return false;
    }
    
    /*
    (2) If a unit u is reduced to only one place for a value d, then put it there.

     for u in units[s]:
        dplaces = [s for s in u if d in values[s]]

        if len(dplaces) == 0:
            return False
	## Contradiction: no place for this value
        elif len(dplaces) == 1:
            # d can only be in one place in unit; assign it there
            if not assign(values, dplaces[0], d):
                return False
    return values
    */
    /**
    * Now iterate through all units of the square. Delete the digit from them
    */
    unitsOfSquare = getUnitsOfSquare(square);
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
            assign(values, dplaces[0].name, digit, dplaces[0].key);
        }
    })
  
    
    return values;

}

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

var unitlist = generateUnitlist();

parseGrid(grid);
console.log(board);


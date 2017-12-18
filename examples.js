'use strict';

var SudokuSolving = require("./sudoku.js");
let grid1 = '003020600900305001001806400008102900700000008006708200002609500800203009005010300'
let grid4 = '030050040008010500460000012070502080000603000040109030250000098001020600080060020'
let grid48 = '001007090590080001030000080000005800050060020004100000080000030100020079020700400'


let s1 = new SudokuSolving(grid48);
let solution = s1.solve();
console.log(solution);

/*
let gridArray = grid.split('');
let solutionArray = sudoku.SudokuSolving.solveGrid(gridArray);
console.log(solutionArray);
*/
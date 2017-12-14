'use strict';

let sudoku = require("./sudoku.js");
let grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300'

let solution = sudoku.SudokuSolving.solveGrid(grid);
console.log(solution);

let gridArray = grid.split('');
let solutionArray = sudoku.SudokuSolving.solveGrid(gridArray);
console.log(solutionArray);
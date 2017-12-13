var sudoku = require("./sudoku.js");
grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300'

var solution = sudoku.SudokuSolving.solveGrid(grid);
console.log(solution);

var gridArray = grid.split('');
var solutionArray = sudoku.SudokuSolving.solveGrid(gridArray);
console.log(solutionArray);
var sudoku = require("../sudoku.js");

describe("invalid grid as parameter", function () {
  it("should throw error", function () {
    var grid = "invalidstring";
   
    expect(function() { sudoku.SudokuSolving.solveGrid(grid); } ).toThrowError("Not a valid grid");  
  });
});

describe("valid grid should give a string with 81 characters", function () {
  it("should throw error", function () {
   var grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
   var solution = sudoku.SudokuSolving.solveGrid(grid);
    expect(solution.length).toBe(81);  
  });
}); 

describe("valid grid should give defined result", function () {
  it("should throw error", function () {
   var grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
   var expected_solution = '483921657967345821251876493548132976729564138136798245372689514814253769695417382';
   var solution = sudoku.SudokuSolving.solveGrid(grid);
    expect(solution).toMatch(expected_solution);  
  });
});
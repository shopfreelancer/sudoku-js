var SudokuSolving = require("../sudoku.js");
var testGrid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';


describe("invalid grid as parameter", function () {
  it("should throw error", function () {
    let invalidGrid = "invalidstringforgrid";

    expect(function() { 
        let s1 = new SudokuSolving(invalidGrid);
    } ).toThrowError("Not a valid grid");  
  });
});

describe("valid grid should give a string with 81 characters", function () {
  it("should throw error", function () {
    let s1 = new SudokuSolving(testGrid);
    let solution = s1.solve();
    expect(solution.length).toBe(81);  
  });
}); 

describe("valid grid should give defined result", function () {
  it("should throw error", function () {
   let grid = '003020600900305001001806400008102900700000008006708200002609500800203009005010300';
   let expectedSolution = '483921657967345821251876493548132976729564138136798245372689514814253769695417382';
   let s1 = new SudokuSolving(grid);
   let solution = s1.solve();
   expect(solution).toMatch(expectedSolution);  
  });
});


describe("unit for square should return 3 arrays", function () {
  it("should return 3 arrays", function () {
    let s1 = new SudokuSolving(testGrid);
    let unitsOfSquare = s1.getUnitsOfSquare("A1");
      
    expect(unitsOfSquare instanceof Array).toBe(true); 
    expect(unitsOfSquare.length).toEqual(3);  
  });
});

describe("peers for square should return array with 20 values", function () {
  it("should return 3 arrays", function () {
    let s1 = new SudokuSolving(testGrid);
    let peersOfSquare = s1.getPeersOfSquare("A1");
      
    expect(peersOfSquare instanceof Array).toBe(true); 
    expect(peersOfSquare.length).toEqual(20);  
  });
});

describe("peers for square c2 right?", function () {
  it("should match the following array", function () {
    let peersC2 = ['A2', 'B2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2',
                               'C1', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
                               'A1', 'A3', 'B1', 'B3'];
      
    let s1 = new SudokuSolving(testGrid);
    let peersOfSquare = s1.getPeersOfSquare("C2"); 
      
    expect(peersOfSquare instanceof Array).toBe(true); 
    expect(peersOfSquare).toEqual(peersC2);  
  });
});

describe("units for square c2 right?", function () {
  it("should match the following 3 arrays", function () {
    let unitsC2 = [['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2'],
                           ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
                           ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']];
      
    let s1 = new SudokuSolving(testGrid);
    let unitsOfSquare = s1.getUnitsOfSquare("C2"); 
      
    expect(unitsOfSquare instanceof Array).toBe(true); 
    expect(unitsOfSquare).toEqual(unitsC2);  
  });
});
# sudoku-js
A Javascript solution for sudoku puzzles.

This is a Javascript implementation of the Python sudoku solving solution by Peter Norvig.
It solves only the easy puzzles with a regualar 9x9 grid.
I needed the implementation for a small project but decided to separate the solution. The first commits contain the transliteration/ copying of the original python code. Which is pretty ugly spaghetti code by nowadays standards. 

A few words on the wording. We have 9x9 squares/ fields. Every field belongs to a row, a column and a region/ sector/ block. So every field has 3 units with 9 fields which is 27 fields. So a unit consits of 3 lists in python or 3 arrays in javascript.
Every field has also 20 peer fields or squares. 

The original article explains what the code does. In goes a representation of the original  board as a string. This is called "grid" and where we start. Some fields have already a solution, other´s don´t. The no fields get a 0 for now. Then those fields get assigned to the squares and I call the sum of all squares a board. 

All squares of the board get assigned as possible values the numbers / digits (123...9). Then the grid values are getting assigned to the board. All other numbers except the correct ones are getting deleted from the square, its peers and its units.

The file is intended for use on the console.
node ../sudoku.js 

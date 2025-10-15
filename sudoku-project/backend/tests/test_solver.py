import unittest
from sudoku.solver import solve_sudoku, is_valid_board


class TestSolver(unittest.TestCase):
    def test_solve_simple(self):
        puzzle = [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9],
        ]
        ok, sol = solve_sudoku(puzzle)
        self.assertTrue(ok)
        self.assertTrue(is_valid_board(sol))
        # All filled
        self.assertTrue(all(all(v != 0 for v in row) for row in sol))


if __name__ == '__main__':
    unittest.main()

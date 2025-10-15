import unittest
from sudoku.generator import generate_puzzle
from sudoku.solver import is_valid_board, has_unique_solution


class TestGenerator(unittest.TestCase):
    def test_generate_unique(self):
        puzzle, solution = generate_puzzle('easy')
        self.assertTrue(is_valid_board(solution))
        self.assertTrue(has_unique_solution(puzzle))
        # puzzle cells should be subset of solution
        for r in range(9):
            for c in range(9):
                if puzzle[r][c] != 0:
                    self.assertEqual(puzzle[r][c], solution[r][c])


if __name__ == '__main__':
    unittest.main()

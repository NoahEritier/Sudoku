import random
from typing import List, Tuple
from .solver import solve_sudoku, has_unique_solution

Board = List[List[int]]

DIGITS = list(range(1, 10))


def empty_board() -> Board:
    return [[0 for _ in range(9)] for _ in range(9)]


def find_empty(board: Board):
    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                return r, c
    return None


def is_safe(board: Board, row: int, col: int, num: int) -> bool:
    # row and col
    if any(board[row][i] == num for i in range(9)):
        return False
    if any(board[i][col] == num for i in range(9)):
        return False
    # box
    br = (row // 3) * 3
    bc = (col // 3) * 3
    for r in range(br, br + 3):
        for c in range(bc, bc + 3):
            if board[r][c] == num:
                return False
    return True


def fill_board(board: Board) -> bool:
    empty = find_empty(board)
    if not empty:
        return True
    r, c = empty
    nums = DIGITS[:]
    random.shuffle(nums)
    for num in nums:
        if is_safe(board, r, c, num):
            board[r][c] = num
            if fill_board(board):
                return True
            board[r][c] = 0
    return False


def generate_full_solution() -> Board:
    board = empty_board()
    fill_board(board)
    return board


def difficulty_to_clues(difficulty: str) -> int:
    mapping = {
        # Slightly increase clues for easier levels and create clearer gaps
        'easy': 45,    # was 40
        'medium': 36,  # was 34
        'hard': 30,    # was 28
        'expert': 24,  # unchanged
    }
    return mapping.get(difficulty, 40)


def generate_puzzle(difficulty: str = 'easy') -> Tuple[Board, Board]:
    """Generate a puzzle and its solution with unique solvability.

    Returns (puzzle, solution)
    """
    solution = generate_full_solution()
    puzzle = [row[:] for row in solution]

    # positions to remove
    cells = [(r, c) for r in range(9) for c in range(9)]
    random.shuffle(cells)

    clues_target = difficulty_to_clues(difficulty)
    removals_allowed = 81 - clues_target

    removed = 0
    for r, c in cells:
        if removed >= removals_allowed:
            break
        backup = puzzle[r][c]
        puzzle[r][c] = 0
        # Ensure unique solution
        if not has_unique_solution([row[:] for row in puzzle]):
            puzzle[r][c] = backup
        else:
            removed += 1

    return puzzle, solution

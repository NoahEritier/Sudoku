from typing import List, Tuple, Optional

Board = List[List[int]]


def is_valid_board(board: Board) -> bool:
    # Check rows, cols, boxes no duplicates ignoring zeros
    for i in range(9):
        row = [n for n in board[i] if n != 0]
        if len(row) != len(set(row)):
            return False
        col = [board[r][i] for r in range(9) if board[r][i] != 0]
        if len(col) != len(set(col)):
            return False
    for br in range(0, 9, 3):
        for bc in range(0, 9, 3):
            box = []
            for r in range(br, br + 3):
                for c in range(bc, bc + 3):
                    v = board[r][c]
                    if v != 0:
                        box.append(v)
            if len(box) != len(set(box)):
                return False
    return True


def find_candidates(board: Board, r: int, c: int) -> List[int]:
    if board[r][c] != 0:
        return []
    used = set()
    used.update(board[r][c2] for c2 in range(9) if board[r][c2] != 0)
    used.update(board[r2][c] for r2 in range(9) if board[r2][c] != 0)
    br, bc = (r // 3) * 3, (c // 3) * 3
    for rr in range(br, br + 3):
        for cc in range(bc, bc + 3):
            if board[rr][cc] != 0:
                used.add(board[rr][cc])
    return [n for n in range(1, 10) if n not in used]


def select_unassigned_mrv(board: Board) -> Optional[Tuple[int, int, List[int]]]:
    best = None
    best_opts = None
    for r in range(9):
        for c in range(9):
            if board[r][c] == 0:
                opts = find_candidates(board, r, c)
                if best_opts is None or len(opts) < len(best_opts):
                    best = (r, c)
                    best_opts = opts
                    if len(best_opts) == 1:
                        return r, c, best_opts
    if best is None:
        return None
    return best[0], best[1], best_opts


def solve_sudoku(board: Board) -> Tuple[bool, Board]:
    # Copy board to avoid in-place modification
    grid = [row[:] for row in board]

    def backtrack() -> bool:
        sel = select_unassigned_mrv(grid)
        if sel is None:
            return True
        r, c, opts = sel
        for v in opts:
            grid[r][c] = v
            if is_valid_board(grid) and backtrack():
                return True
            grid[r][c] = 0
        return False

    solved = backtrack()
    return solved, grid if solved else board


def count_solutions(board: Board, limit: int = 2) -> int:
    grid = [row[:] for row in board]
    count = 0

    def backtrack():
        nonlocal count
        if count >= limit:
            return
        sel = select_unassigned_mrv(grid)
        if sel is None:
            count += 1
            return
        r, c, opts = sel
        for v in opts:
            grid[r][c] = v
            if is_valid_board(grid):
                backtrack()
            grid[r][c] = 0

    backtrack()
    return count


def has_unique_solution(board: Board) -> bool:
    return count_solutions(board, limit=2) == 1

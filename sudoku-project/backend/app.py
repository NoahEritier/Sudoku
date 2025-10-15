from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import json
import uuid
from sudoku.generator import generate_puzzle
from sudoku.solver import solve_sudoku, is_valid_board, has_unique_solution

DB_PATH = os.path.join(os.path.dirname(__file__), 'sudoku.db')

app = Flask(__name__)
CORS(app)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS games (
            id TEXT PRIMARY KEY,
            difficulty TEXT,
            puzzle TEXT,
            solution TEXT,
            state TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
    )
    conn.commit()
    conn.close()


@app.route('/api/generate', methods=['GET'])
def api_generate():
    difficulty = request.args.get('difficulty', 'easy')
    puzzle, solution = generate_puzzle(difficulty)
    return jsonify({
        'difficulty': difficulty,
        'puzzle': puzzle,
        'solution': solution
    })


@app.route('/api/validate', methods=['POST'])
def api_validate():
    data = request.get_json(force=True)
    board = data.get('board')
    if not isinstance(board, list) or len(board) != 9:
        return jsonify({'ok': False, 'error': 'Invalid board format'}), 400
    valid = is_valid_board(board)
    return jsonify({'ok': True, 'valid': valid})


@app.route('/api/solve', methods=['POST'])
def api_solve():
    data = request.get_json(force=True)
    board = data.get('board')
    if not isinstance(board, list) or len(board) != 9:
        return jsonify({'ok': False, 'error': 'Invalid board format'}), 400
    solved, solution = solve_sudoku(board)
    if not solved:
        return jsonify({'ok': False, 'error': 'Unsolvable board'}), 400
    return jsonify({'ok': True, 'solution': solution})


@app.route('/api/save', methods=['POST'])
def api_save():
    data = request.get_json(force=True)
    game_id = data.get('id') or str(uuid.uuid4())
    difficulty = data.get('difficulty', 'unknown')
    puzzle = data.get('puzzle')
    solution = data.get('solution')
    state = data.get('state')

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id FROM games WHERE id = ?", (game_id,))
    exists = cur.fetchone() is not None
    if exists:
        cur.execute(
            """
            UPDATE games
            SET difficulty = ?, puzzle = ?, solution = ?, state = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (difficulty, json.dumps(puzzle), json.dumps(solution), json.dumps(state), game_id)
        )
    else:
        cur.execute(
            """
            INSERT INTO games (id, difficulty, puzzle, solution, state)
            VALUES (?, ?, ?, ?, ?)
            """,
            (game_id, difficulty, json.dumps(puzzle), json.dumps(solution), json.dumps(state))
        )
    conn.commit()
    conn.close()
    return jsonify({'ok': True, 'id': game_id})


@app.route('/api/load', methods=['GET'])
def api_load():
    game_id = request.args.get('id')
    if not game_id:
        return jsonify({'ok': False, 'error': 'Missing id'}), 400
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM games WHERE id = ?", (game_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return jsonify({'ok': False, 'error': 'Not found'}), 404
    return jsonify({
        'ok': True,
        'id': row['id'],
        'difficulty': row['difficulty'],
        'puzzle': json.loads(row['puzzle']),
        'solution': json.loads(row['solution']) if row['solution'] else None,
        'state': json.loads(row['state']) if row['state'] else None,
    })

 # Initialize DB at import time to avoid relying on removed Flask hooks
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
init_db()


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)

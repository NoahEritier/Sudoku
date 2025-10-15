# Sudoku Project

## Estructura

```
/sudoku-project
  /backend
    app.py
    /sudoku
      generator.py
      solver.py
    requirements.txt
  /frontend
    index.html
    vite.config.js
    postcss.config.js
    tailwind.config.js
    /src
      App.jsx
      index.jsx
      /components
        Board.jsx
        Cell.jsx
        Controls.jsx
      /styles
        tailwind.css
  README.md
```

## Backend (Flask)

- Endpoints:
  - `GET /api/generate?difficulty=easy|medium|hard|expert`
  - `POST /api/validate` body: `{ board: number[9][9] }`
  - `POST /api/solve` body: `{ board: number[9][9] }`
  - `POST /api/save` body: `{ id?, difficulty, puzzle, solution?, state }` -> retorna `{ id }`
  - `GET /api/load?id=<id>`

- Arranque:
```
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
python app.py     # o: flask --app app run --debug
```

## Frontend (React + Vite + Tailwind)

- Variables opcionales: `VITE_API_URL` (por defecto `http://localhost:5000`)
- Arranque:
```
cd frontend
npm install
npm run dev
```

## Tests

```
cd backend
python -m unittest discover -s tests -p "test_*.py"
```

## Notas

- Generador con backtracking garantizando solución única.
- Solver con heurística MRV.
- CORS habilitado en Flask.
- Persistencia básica con SQLite para `save/load`.
- Progreso también se guarda en `localStorage` automáticamente.

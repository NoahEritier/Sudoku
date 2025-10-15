# 🧩 Sudoku Web App — Full Stack Python + React

Aplicación web full stack que implementa el juego **Sudoku 9x9** con un **backend en Flask (Python)** encargado de la generación y validación de tableros, y un **frontend en React** que gestiona la interacción del usuario, el renderizado del tablero y la comunicación asíncrona con la API.

---

## 📂 Estructura General

sudoku-web/
│
├── backend/
│ ├── app.py # Entry point de la API Flask
│ ├── sudoku_logic.py # Algoritmos de generación, validación y resolución
│ ├── utils/
│ │ ├── generator.py # Generador de tableros aleatorios válidos
│ │ ├── validator.py # Validador de reglas Sudoku
│ │ └── solver.py # Resolver por backtracking
│ ├── requirements.txt # Dependencias backend
│ └── config.py # Configuración base y constantes
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Componentes visuales y funcionales
│ │ │ ├── Board.jsx
│ │ │ ├── Cell.jsx
│ │ │ ├── Controls.jsx
│ │ │ ├── Sidebar.jsx
│ │ │ └── Header.jsx
│ │ ├── context/ # Context API para estado global
│ │ │ └── GameContext.jsx
│ │ ├── hooks/ # Custom hooks (timer, teclado, etc.)
│ │ ├── utils/ # Funciones utilitarias (manejo de tablero)
│ │ ├── services/ # Funciones de comunicación API
│ │ │ └── api.js
│ │ ├── pages/ # Home, Game
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
└── README.md

---

## 🧩 Arquitectura General

**Tipo de arquitectura:** cliente-servidor desacoplado (SPA + REST API)  
**Comunicación:** HTTP con payloads en JSON  
**Estado persistente:** LocalStorage (progreso de partida, configuración de usuario)  
**Flujo de datos:** unidireccional (React Context API)

### 🔸 Flujo de interacción
1. El frontend solicita un nuevo tablero al backend (`GET /api/sudoku?difficulty=medium`).
2. El backend genera un tablero válido con algoritmo de backtracking.
3. El usuario interactúa con las celdas, actualizando el estado global.
4. Al presionar **Verificar**, el frontend envía el tablero actual al backend (`POST /api/validate`).
5. El backend retorna `valid: True/False` y los errores detectados.
6. Si el tablero está completo, el backend valida la solución completa.
7. El resultado se refleja visualmente (resaltado, mensaje de éxito, etc.).

---

## ⚙️ Backend (Flask)

### Dependencias:
```txt
Flask==3.0.0
Flask-Cors==4.0.0
numpy==1.26.0
Estructura lógica:
generator.py → genera tableros válidos con celdas vacías según dificultad.

solver.py → resuelve tableros usando backtracking.

validator.py → verifica filas, columnas y regiones 3x3.

app.py → expone los endpoints REST y coordina las funciones.

Endpoints:
Método	Ruta	Descripción	Input	Output
GET	/api/sudoku	Genera un nuevo tablero según dificultad	difficulty (query param)	{ board: [[int]] }
POST	/api/validate	Valida tablero parcial o completo	{ board: [[int]] }	{ valid: bool, errors: [[int, int]] }
POST	/api/solve	Devuelve la solución completa del tablero	{ board: [[int]] }	{ solved: [[int]] }

Ejemplo de respuesta /api/sudoku
{
  "board": [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    ...
  ]
}
💻 Frontend (React)
Tecnologías:
React 18+

Tailwind CSS (modo oscuro y claro)

Framer Motion (animaciones)

Context API (estado global)

Vite (dev server)

Estado global:
GameContext.jsx

board: tablero actual

solution: solución del tablero

notes: modo notas activo

errors: posiciones inválidas

timer: segundos transcurridos

difficulty: nivel seleccionado

history: stack para undo/redo

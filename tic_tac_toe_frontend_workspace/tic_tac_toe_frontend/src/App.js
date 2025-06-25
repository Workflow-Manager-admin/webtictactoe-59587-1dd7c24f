import React, { useState, useEffect } from "react";
import "./App.css";

// Board size for classic Tic Tac Toe
const BOARD_SIZE = 3;

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("Player X's turn");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // Handle cell click
  // PUBLIC_INTERFACE
  function handleClick(index) {
    if (board[index] || gameOver) return;
    const nextBoard = board.slice();
    nextBoard[index] = isXNext ? "X" : "O";
    setBoard(nextBoard);

    const gameResult = calculateGameState(nextBoard);
    if (gameResult.winner) {
      setGameOver(true);
      setWinner(gameResult.winner);
      setStatus(`Player ${gameResult.winner} wins!`);
    } else if (gameResult.isDraw) {
      setGameOver(true);
      setWinner(null);
      setStatus("It's a draw!");
    } else {
      setIsXNext(!isXNext);
      setStatus(`Player ${isXNext ? "O" : "X"}'s turn`);
    }
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setStatus("Player X's turn");
  }

  // Focus on centered and minimalistic layout
  return (
    <div className="ttt-root">
      <div className="ttt-container">
        <header>
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div
            className="ttt-status"
            style={{
              color: gameOver
                ? winner
                  ? "var(--ttt-accent)"
                  : "var(--ttt-secondary)"
                : "var(--ttt-primary)",
              background: gameOver
                ? winner
                  ? "rgba(255,179,0,0.07)"
                  : "rgba(66,66,66,0.09)"
                : "none",
              borderRadius: "8px",
              padding: "8px 14px",
              marginBottom: "18px",
              borderWidth: "1px",
              borderColor: "#f2f2f2",
              borderStyle: "solid"
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            {status}
          </div>
        </header>
        <Board
          board={board}
          onCellClick={handleClick}
          winLine={gameOver && winner ? findWinLine(board, winner) : null}
        />
        <button
          className="ttt-reset-btn"
          style={{
            background: "var(--ttt-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 32px",
            marginTop: "32px",
            fontSize: "17px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onClick={handleReset}
        >
          Restart Game
        </button>
        {gameOver && (
          <div className="ttt-notification" role="status">
            {winner ? (
              <span>
                <span
                  style={{
                    fontWeight: 700,
                    color: "var(--ttt-accent)"
                  }}
                >
                  Player {winner}
                </span>{" "}
                wins! 🎉
              </span>
            ) : (
              <span>
                <span style={{ fontWeight: 700, color: "var(--ttt-secondary)" }}>
                  Draw!
                </span>{" "}
                No winners this round.
              </span>
            )}
          </div>
        )}
      </div>
      <footer className="ttt-footer">
        <small>Modern React Tic Tac Toe &copy; {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winLine }) {
  // Build rows
  let rows = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const cells = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      const idx = r * BOARD_SIZE + c;
      const isWinCell = winLine && winLine.includes(idx);
      cells.push(
        <Square
          value={board[idx]}
          key={idx}
          onClick={() => onCellClick(idx)}
          highlight={isWinCell}
        />
      );
    }
    rows.push(
      <div className="ttt-board-row" key={r}>
        {cells}
      </div>
    );
  }
  return <div className="ttt-board">{rows}</div>;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      style={{
        color: highlight
          ? "#fff"
          : value === "X"
          ? "var(--ttt-primary)"
          : value === "O"
          ? "var(--ttt-secondary)"
          : "#cccccc",
        background: highlight ? "var(--ttt-accent)" : "#fff",
        boxShadow: highlight
          ? "0 3px 17px 0 rgba(255,179,0,0.10)"
          : "0 1px 7px 0 rgba(25,118,210,0.07)",
        border: `2px solid ${
          highlight
            ? "var(--ttt-accent)"
            : value === "X"
            ? "var(--ttt-primary)"
            : value === "O"
            ? "var(--ttt-secondary)"
            : "#eee"
        }`
      }}
      onClick={onClick}
      disabled={!!value}
      aria-label={value ? `${value} placed here` : "Empty square"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function calculateGameState(board) {
  // Board: Array[9]
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return { winner: board[a], isDraw: false };
    }
  }
  if (board.every((cell) => cell != null)) {
    return { winner: null, isDraw: true };
  }
  return { winner: null, isDraw: false };
}

function findWinLine(board, winner) {
  // Used to highlight win line
  const lines = [
    [0, 1, 2], // Rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // Columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // Diagonals
    [2, 4, 6]
  ];
  for (const line of lines) {
    if (
      board[line[0]] === winner &&
      board[line[1]] === winner &&
      board[line[2]] === winner
    ) {
      return line;
    }
  }
  return null;
}

export default App;

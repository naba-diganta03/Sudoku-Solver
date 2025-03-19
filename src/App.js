import React, { useState, useEffect, useRef, useCallback } from "react";
import "./SudokuSolver.css";

const N = 9;

const SudokuSolver = () => {
  const [board, setBoard] = useState(Array.from({ length: N }, () => Array(N).fill(0)));
  const [darkMode, setDarkMode] = useState(false);
  const [currentCellIndex, setCurrentCellIndex] = useState(0);
  const inputRefs = useRef([]);

  const handleInput = (row, col, value) => {
    const newBoard = [...board];
    newBoard[row][col] = value ? parseInt(value) : 0;
    setBoard(newBoard);
  };

  const isValid = (row, col, num) => {
    for (let i = 0; i < N; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  };

  const solveSudoku = () => {
    const solve = () => {
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(row, col, num)) {
                board[row][col] = num;
                if (solve()) return true;
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (solve()) alert("🎉 Sudoku Solved Successfully!");
    else alert("❌ Unsolvable Sudoku!");
    setBoard([...board]);
  };

  const resetBoard = () => setBoard(Array.from({ length: N }, () => Array(N).fill(0)));

  const generateRandomSudoku = () => {
    const generateRandomBoard = () => {
      const newBoard = Array.from({ length: N }, () => Array(N).fill(0));
      for (let i = 0; i < 20; i++) {
        const row = Math.floor(Math.random() * N);
        const col = Math.floor(Math.random() * N);
        const num = Math.floor(Math.random() * 9) + 1;
        if (isValid(row, col, num)) newBoard[row][col] = num;
      }
      return newBoard;
    };
    setBoard(generateRandomBoard());
  };

  // 🚀 Keyboard Navigation with Auto-Focus
  const handleKeyDown = useCallback(
    (e) => {
      const row = Math.floor(currentCellIndex / N);
      const col = currentCellIndex % N;
      let newIndex = currentCellIndex;

      switch (e.key) {
        case "ArrowRight":
          if (col < 8) newIndex += 1;
          break;
        case "ArrowLeft":
          if (col > 0) newIndex -= 1;
          break;
        case "ArrowDown":
          if (row < 8) newIndex += N;
          break;
        case "ArrowUp":
          if (row > 0) newIndex -= N;
          break;
        default:
          return;
      }

      setCurrentCellIndex(newIndex);
      inputRefs.current[newIndex]?.focus();
    },
    [currentCellIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className={`sudoku-container ${darkMode ? "dark" : ""}`}>
      <h1 className="title">SUDOKU SOLVER</h1>
      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>
      <div className="sudoku-board colorful">
        {board.map((row, rIdx) =>
          row.map((num, cIdx) => (
            <input
              key={`${rIdx}-${cIdx}`}
              type="text"
              value={num || ""}
              maxLength="1"
              onChange={(e) => handleInput(rIdx, cIdx, e.target.value)}
              className={`cell ${num ? "filled" : ""} ${currentCellIndex === rIdx * N + cIdx ? "active" : ""}`}
              onClick={() => setCurrentCellIndex(rIdx * N + cIdx)}
              ref={(el) => (inputRefs.current[rIdx * N + cIdx] = el)}
            />
          ))
        )}
      </div>
      <div className="controls">
        <button onClick={solveSudoku} className="solve-btn">
          ✅ Solve
        </button>
        <button onClick={resetBoard} className="reset-btn">
          🔄 Reset
        </button>
        <button onClick={generateRandomSudoku} className="generate-btn">
          🎲 Generate Puzzle
        </button>
      </div>
    </div>
  );
};

export default SudokuSolver;

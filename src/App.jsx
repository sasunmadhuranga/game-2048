import React, { useState, useEffect } from "react";
import "./App.css";

const SIZE = 4;

const generateEmptyBoard = () =>
  Array(SIZE)
    .fill()
    .map(() => Array(SIZE).fill(0));

const getRandomEmptyCell = (board) => {
  const empty = [];
  board.forEach((row, r) =>
    row.forEach((cell, c) => {
      if (cell === 0) empty.push([r, c]);
    })
  );
  return empty[Math.floor(Math.random() * empty.length)];
};

const addRandomTile = (board) => {
  const newBoard = board.map((row) => [...row]);
  const emptyCell = getRandomEmptyCell(newBoard);
  if (emptyCell) {
    const [r, c] = emptyCell;
    newBoard[r][c] = Math.random() > 0.5 ? 2 : 4;
  }
  return newBoard;
};

const slide = (row) => {
  let arr = row.filter((val) => val);
  let gainedScore = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      gainedScore += arr[i]; 
      arr[i + 1] = 0;
    }
  }

  arr = arr.filter((val) => val);
  while (arr.length < SIZE) arr.push(0);

  return { newRow: arr, gainedScore };
};

function App() {
  const [board, setBoard] = useState(generateEmptyBoard());
  const [score, setScore] = useState(0);

  useEffect(() => {
    let newBoard = generateEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
  }, []);

  const moveLeft = () => {
    let totalScore = 0;

    const newBoard = board.map((row) => {
      const { newRow, gainedScore } = slide(row);
      totalScore += gainedScore;
      return newRow;
    });

    setScore(score + totalScore);
    setBoard(addRandomTile(newBoard));
  };

  const moveRight = () => {
    let totalScore = 0;

    const newBoard = board.map((row) => {
      const { newRow, gainedScore } = slide([...row].reverse());
      totalScore += gainedScore;
      return newRow.reverse();
    });

    setScore(score + totalScore);
    setBoard(addRandomTile(newBoard));
  };

  const transpose = (matrix) =>
    matrix[0].map((_, colIndex) =>
      matrix.map((row) => row[colIndex])
    );

  const moveUp = () => {
    let totalScore = 0;
    let newBoard = transpose(board);

    newBoard = newBoard.map((row) => {
      const { newRow, gainedScore } = slide(row);
      totalScore += gainedScore;
      return newRow;
    });

    newBoard = transpose(newBoard);

    setScore(score + totalScore);
    setBoard(addRandomTile(newBoard));
  };

  const moveDown = () => {
    let totalScore = 0;
    let newBoard = transpose(board);

    newBoard = newBoard.map((row) => {
      const { newRow, gainedScore } = slide([...row].reverse());
      totalScore += gainedScore;
      return newRow.reverse();
    });

    newBoard = transpose(newBoard);

    setScore(score + totalScore);
    setBoard(addRandomTile(newBoard));
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "ArrowUp":
        moveUp();
        break;
      case "ArrowDown":
        moveDown();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="container">
      <h1>2048 Game</h1>
      <h2>Score: {score}</h2>
      <div className="grid">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className="cell"
              data-value={cell !== 0 ? cell : undefined}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      <button onClick={() => window.location.reload()}>
        Restart
      </button>
    </div>
  );
}

export default App;
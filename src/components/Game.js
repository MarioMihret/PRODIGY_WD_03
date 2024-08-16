import React, { useState, useCallback, useEffect } from 'react';

const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(""));
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [mode, setMode] = useState(null);

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWinner = (newBoard) => {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
                return newBoard[a];
            }
        }
        return newBoard.includes("") ? null : "Draw";
    };

    const handleClick = useCallback((index) => {
        if (board[index] !== "" || isGameOver) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const gameResult = checkWinner(newBoard);
        if (gameResult) {
            setIsGameOver(true);
            setWinner(gameResult);
        } else {
            setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        }
    }, [board, currentPlayer, isGameOver]);

    const resetGame = () => {
        setBoard(Array(9).fill(""));
        setCurrentPlayer("X");
        setIsGameOver(false);
        setWinner(null);
    };

    const aiMove = useCallback(() => {
        const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(val => val !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        handleClick(randomIndex);
    }, [board, handleClick]);

    useEffect(() => {
        if (mode === "AI" && currentPlayer === "O" && !isGameOver) {
            const timeout = setTimeout(() => aiMove(), 500);
            return () => clearTimeout(timeout);
        }
    }, [currentPlayer, isGameOver, mode, aiMove]);

    const chooseMode = (selectedMode) => {
        setMode(selectedMode);
        resetGame();
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h1 className='text-4xl font-bold mb-8'>Tic-Tac-Toe Game</h1>
            {mode === null ? (
                <div className='mb-8'>
                    <button
                        onClick={() => chooseMode("PVP")}
                        className='px-4 py-2 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-700 mr-4'
                    >
                        Player vs. Player
                    </button>
                    <button
                        onClick={() => chooseMode("AI")}
                        className='px-4 py-2 bg-green-500 text-white text-lg font-semibold rounded hover:bg-green-700'
                    >
                        Player vs. AI
                    </button>
                </div>
            ) : (
                <>
                    {winner && (
                        <div className='mb-4 text-2xl'>
                            {winner === "Draw" ? "It's a Draw!" : `Player ${winner} Wins!`}
                        </div>
                    )}
                    <div className='grid grid-cols-3 gap-4'>
                        {board.map((value, index) => (
                            <button
                                key={index}
                                onClick={() => handleClick(index)}
                                className='w-24 h-24 text-2xl font-bold flex items-center justify-center bg-white border-2 border-gray-400 hover:bg-gray-200'
                                disabled={value !== "" || isGameOver}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={resetGame}
                        className='mt-8 px-4 py-2 bg-blue-500 text-white text-lg font-semibold rounded hover:bg-blue-700'
                    >
                        Reset Game
                    </button>
                </>
            )}
        </div>
    );
};

export default Game;

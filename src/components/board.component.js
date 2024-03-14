import React, {useEffect, useState, useCallback} from 'react'
import Square from './square.component';
import { useChannelStateContext, useChatContext } from 'stream-chat-react';

const Board = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");
  const {channel} = useChannelStateContext();
  const {client} = useChatContext();

  const chooseSquare = async (square) => {
    if (board[square] || calculateWinner()) return;

    if (!board[square] && turn === player) {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "game-move",
        data: { square, player }
      });

      setBoard(board.map((val, idx) => {
        if (idx === square) {
          return player;
        } else {
          return val;
        }
      }));
    }
  };

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";
      setPlayer(currentPlayer);
      setTurn(currentPlayer);
      setBoard(board.map((val, idx) => {
        if (idx === event.data.square) {
          return event.data.player;
        } else {
          return val;
        }
      }));
    }
  });
  
  const calculateWinner = useCallback(() => {
    const winArray = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winArray.length; i++) {
      const [a, b, c] = winArray[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }, [board]);

  const calculateDraw = useCallback(() => {
    if (board.every((item) => item !== null)) {
      alert("Draw");
    }
  }, [board]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setTurn("X");
  };

  useEffect(() => {
    if(calculateWinner()) {
      alert(`${player} won`)
    }
    calculateDraw()
  }, [board, player, calculateWinner, calculateDraw])

  return (
    <div className='board'>
      <div className='row'>
        <Square 
        chooseSquare={() => {
          chooseSquare(0)}} 
        val={board[0]}
        />
        <Square 
        chooseSquare={() => {
          chooseSquare(1)}} 
        val={board[1]}
        />
        <Square 
        chooseSquare={() => {
          chooseSquare(2)}} 
        val={board[2]}
        />
      </div>
      <div className='row'>
        <Square 
        chooseSquare={() => {
          chooseSquare(3)}} 
        val={board[3]}
        />
        <Square 
        chooseSquare={() => {
          chooseSquare(4)}} 
        val={board[4]}
        />
        <Square 
        chooseSquare={() => {
          chooseSquare(5)}} 
        val={board[5]}
        />
      </div>
      <div className='row'>
        <Square 
        chooseSquare={() => {
          chooseSquare(6)}} 
        val={board[6]}
        />
        <Square 
        chooseSquare={() => {
          chooseSquare(7)}} 
        val={board[7]}
        />
        <Square 
        chooseSquare={() => {
          chooseSquare(8)}} 
        val={board[8]}
        />
      </div>
      <button 
        className='reset' type='button'
        onClick={reset}
      >Reset
      </button>
    </div>
  )
};

export default Board;

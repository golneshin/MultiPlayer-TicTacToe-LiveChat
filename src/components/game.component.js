import React, { useState } from 'react';
import {Window, MessageList, MessageInput} from 'stream-chat-react';
import Board from './board.component';
import './chat.style.css';

const Game = ({channel}) => {
  const [playerJoined, setPlayerJoined] = useState(
    channel.state.watcher_count === 2);

  channel.on('user.watching.start', () => {
    setPlayerJoined(true);
  });

  if (!playerJoined) {
    return <h1>Wait for Rival to Join. . .</h1>
  }
  
  return (
    <div className='game-container'>
      <Board/>
      <Window>
        <MessageList 
          disableDateSeparator 
          closeReactionSelectorOnClick
          hideDeletedMessages
          messageActions={[React]}
        />
        <MessageInput noFiles/>
      </Window>
      {/* LEAVE GAME BUTTON */}
    </div>
  );
};

export default Game;

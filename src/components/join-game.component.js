import React, { useState } from 'react';
import {useChatContext, Channel} from 'stream-chat-react';
import Game from './game.component';
import CustomInput from './custom-input.component';

const JoinGame = () => {
  const [rivalUsername, setRivalUsername] = useState("");
  const [channel, setChannel] = useState(null);
  const { client } = useChatContext();
  console.log(client)
  const createChannel = async () => {
    const response = await client.queryUsers(
      {name: {$eq: rivalUsername}},
      {timeout: 10000}
    );

    if (!response.users.length) {
      alert("User not found");
      return;
    }

    const newChannel = await client.channel("messaging", {
      members: [response.users[0].id, client.userID]
    })

    newChannel.watch();
    setChannel(newChannel);
  };

  return ( 
    <>
      {channel ? (
          <Channel channel={channel} Input={CustomInput}>
            <Game channel={channel} setChannel={setChannel}/>
            <h4 className='win-lose'>WIn LOSE</h4>
          </Channel>
        ) : (
          <div className='join-game'>
            <h4>
            {`Dear ${client._user.firstName.toUpperCase()}, join your rival...`} 
            </h4>
            <input 
              type="text" 
              placeholder="Username of Rival. . ." 
              onChange={(event) => 
                setRivalUsername(event.target.value)} 
              onClick={createChannel}
            />
            <button onClick={createChannel}>JOIN</button>
          </div>
        )
      }
    </>
  )
};

export default JoinGame;

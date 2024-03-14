import {StreamChat} from "stream-chat";
import { useState } from 'react';
import Cookies from 'universal-cookie';
import { Chat } from 'stream-chat-react';

import SignUp from './components/sign-up.component';
import Login from './components/login.component';
import JoinGame from './components/join-game.component';
import './App.css';

function App() {
  const api_key = "qmmq6pfxwh2v";
  const cookies = new Cookies();
  const token = cookies.get("token");
  const client = StreamChat.getInstance(api_key);
  const [isAuth, setIsAuth] = useState(false);
  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    client.disconnectUser();
    setIsAuth(false);
  };

  if (token) {
    client
      .connectUser({
        id: cookies.get("userId"),
        name: cookies.get("username"),
        firstName: cookies.get("firstName"),
        lastName: cookies.get("lastName"),
        hashedPassword: cookies.get("hashedPassword"),
    }, token).then((user) => {
      setIsAuth(true);
    })
  }

  return (
    <div className="App">
      {isAuth ?
        <Chat client={client}>
          <JoinGame/>
          <div className="footer">
            <h4>Or</h4>
            <button 
              onClick={logOut} 
              className="log-out"
            >Log Out
            </button>
          </div>
          
        </Chat> 
        :
        <>
          <h4 >Tic Tac Toe </h4>
          <SignUp setIsAuth={setIsAuth}/>
          <Login setIsAuth={setIsAuth}/>
        </>
      }
    </div>
  );
};

export default App;

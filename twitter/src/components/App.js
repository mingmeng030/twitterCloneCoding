import React, {useEffect, useState} from 'react';
import AppRouter from "./Router";
import { authService } from "../fBase";
import {onAuthStateChanged} from '@firebase/auth';

function App() {
  const [init, setInit]=useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(()=>{
      onAuthStateChanged(authService, (user) => {
        if(user!==null) {
          setIsLoggedIn(true);
          setUserInfo({user});
        }
        else setIsLoggedIn(false);
        setInit(true);
    });
  },[]);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} userInfo={userInfo}/> : "Initializing..."}
      <footer>&copy; twitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;

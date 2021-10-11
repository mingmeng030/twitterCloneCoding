import React, {useEffect, useState} from 'react';
import AppRouter from "./Router";
import { authService } from "../fBase";
import {onAuthStateChanged} from '@firebase/auth';

function App() {
  const [init, setInit]=useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(()=>{
      onAuthStateChanged(authService, (user) => {
        if(user!==null) setIsLoggedIn(true);
        else setIsLoggedIn(false);
        setInit(true);
        console.log(user);
    });
  },[]);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "Initializing..."}
      <footer>&copy; twitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;

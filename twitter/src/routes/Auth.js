import { authService } from '../fBase'
import React from 'react'
import {GoogleAuthProvider, signInWithPopup} from '@firebase/auth'


const Auth=()=>{
    const onSocialClick = async (event) => {
        const { target: { name }} = event;
        let provider;
        if (name === "google") 
            provider = new GoogleAuthProvider();
        const data=await signInWithPopup(authService, provider);
    };

    return(
        <div>
            <button onClick={onSocialClick} name="google">
                sign in with Google
            </button>
        </div>
    );
}
export default Auth;

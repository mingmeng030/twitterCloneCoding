import React from 'react';
import {Link} from "react-router-dom";

const Navigation = ({userInfo}) =>{
    const userName=userInfo[Object.keys(userInfo)[0]].displayName;
    return(
        <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">{userName}'s profile</Link></li>
        </ul>
        </nav>
    );
};

export default Navigation;
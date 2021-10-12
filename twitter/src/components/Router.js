import React from 'react';
import {Redirect, HashRouter as Router, Route, Switch} from "react-router-dom"
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation"

const AppRouter = (isLoggedIn, {userInfo})=>{
    const flag=isLoggedIn[Object.keys(isLoggedIn)[0]];

    return( 
        <Router>
            {flag&&<Navigation/>}
            <Switch>
                {flag? (
                    <> 
                        <Route exact path="/"><Home userInfo={isLoggedIn.userInfo}/></Route>
                        <Route exact path="/profile"><Profile /></Route>
                        <Redirect from="*" to="/" />
                    </>
                ) : (
                    <>
                        <Route exact path="/"><Auth /></Route>
                        <Redirect from="*" to="/" />
                    </>
                )}
            </Switch>
        </Router>
    );
}
export default AppRouter;
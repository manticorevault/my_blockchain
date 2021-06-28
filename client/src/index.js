import React from "react";
import { render } from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";

import App from "./components/App";
import Blocks from "./components/Blocks";

import "./index.css";

render(
    <Router history={ history }>
        <Switch>
            <Route exact={true} path="/" component={ App } />

            <Route path="/blocks" component={ Blocks } />
        </Switch>
    </Router>,
    
    document.getElementById(
        "root"
    )        
);
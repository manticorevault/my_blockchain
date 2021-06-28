import React from "react";
import { render } from "react-dom";
import { Router, Route, Switch } from "react-router-dom";
import history from "./history";

import App from "./components/App";
import Blocks from "./components/Blocks";
import Transact from "./components/Transact";
import TransactionPool from "./components/TransactionPool";

import "./index.css";

render(
    <Router history={ history }>
        <Switch>
            <Route exact={true} path="/" component={ App } />

            <Route path="/blocks" component={ Blocks } />

            <Route path="/transact" component={ Transact } />

            <Route path="/transaction-pool" component={ TransactionPool } />
        </Switch>
    </Router>,
    
    document.getElementById(
        "root"
    )        
);
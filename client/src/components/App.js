import React, { Component } from "react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

class App extends Component { 

    state = { walletInfo: {

    } };

    componentDidMount() {

        fetch("http://localhost:3000/api/wallet-info")
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));

    }

    render() {

        const { address, balance } = this.state.walletInfo;

        return (
            <div className="App">

                <img className="logo" src={logo} />
                
                <br />
                
                <div>
                    My Wallet
                </div>

                <br />

                <div>
                    <Link to="/blocks">
                        Block Scanner
                    </Link>
                </div>

                <div>
                    <Link to="/transact">
                        Handle Transactions
                    </Link>
                </div>

                <br />

                <div className="WalletInfo">
                    <div>
                        Address: {address}
                    </div>

                    <div>
                        Balance: {balance}
                    </div>
                </div>

            </div>
        )
    }
 }

 export default App;
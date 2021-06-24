import React, { Component } from "react";

class App extends Component { 

    state = { walletInfo: {
        address: "test-wallet",
        balance: "4242"
    } };

    componentDidMount() {

        fetch("http://localhost:3000/api/wallet-info")
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));

    }

    render() {

        const { address, balance } = this.state.walletInfo;

        return (
            <div>
                
                <div>
                    This is the App Component
                </div>

                <div>
                    Address: {address}
                </div>

                <div>
                    Balance: {balance}
                </div>
            </div>
        )
    }
 }

 export default App;
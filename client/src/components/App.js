import React, { Component } from "react";

class App extends Component { 

    state = { walletInfo: {
        address: "test-wallet",
        balance: "4242"
    } };

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
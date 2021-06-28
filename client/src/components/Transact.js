import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";

class Transact extends Component {
    state = { recipient: "", amount: 0 }

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) });
    }

    render () {

        console.log("this.state", this.state);

        return (
            <div className="Transact">
                <Link to="/">
                    My Wallet
                </Link>

                <h2>
                    Handling Transactions
                </h2>

                <FormGroup>
                    <FormControl 
                        input="text"
                        placeholder="Recipient Address"
                        value={ this.state.recipient }
                        onChange={ this.updateRecipient }
                    />
                </FormGroup>

                <FormGroup>
                    <FormControl 
                        input="number"
                        placeholder="Transaction Value"
                        value={ this.state.amount }
                        onChange={ this.updateAmount }
                    />
                </FormGroup>
            </div>
        )
    };
}

export default Transact;
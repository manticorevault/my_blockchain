import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";
import { Link } from "react-router-dom";
import history from "../history";

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    };

    fetchMineTransactions = () => {
        fetch(`${ document.location.origin }/api/mine-transactions`)
            .then(response => {
                if (response.status === 200) {
                    alert("Successfully Mined!");
                    history.push("/blocks");
                } else {
                    alert("This Mining request could not be completed");
                }
            })
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.fetchPoolMapInterval = setInterval(
            () => this.fetchTransactionPoolMap(),
            POLL_INTERVAL_MS
        )
    }

    componentWillUnmount() {
        clearInterval(this.fetchPoolMapInterval);
    }

    render() {
        return (
            <div className="TransactionPool">
                <div>
                    <Link to="/">
                        My Wallet
                    </Link>
                </div>

                    <h2>
                        Transaction Pool
                    </h2>

                    {
                        Object.values(this.state.transactionPoolMap)
                            .map(transaction => {
                            
                            return (
                                <div key={ transaction.id }>
                                    <hr />

                                    <Transaction transaction={transaction} />
                                </div>
                            )
                        })
                    }
            
                <hr />

                <Button 
                    bsStyle="danger"
                    onClick={ this.fetchMineTransactions }
                > 
                    Mine Transaction 
                </Button>
            </div>
        )
    }
}

export default TransactionPool;
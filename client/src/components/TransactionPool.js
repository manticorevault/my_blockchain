import React, { Component } from "react";
import Transaction from "./Transaction";
import { Link } from "react-router-dom";

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`http://localhost:3000/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    };

    componentDidMount() {
        this.fetchTransactionPoolMap();
    }

    render() {
        return (
            <div className="TransactionPool">
                <div>
                    <Link to="/">
                        My Wallet
                    </Link>

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
                </div>
            </div>
        )
    }
}

export default TransactionPool;
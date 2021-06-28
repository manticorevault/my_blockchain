import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

class Block extends Component {
    state = { transactionVisual: false };

    transactionToggle = () => {
        this.setState({ transactionVisual: !this.state.transactionVisual });
    }

    get transactionVisual() {

        const {
            data
        } = this.props.block;

        const stringifiedData = JSON.stringify(data);

        const dataVisual = stringifiedData.length > 42 ? 
            `${stringifiedData.substring(0, 42)}` : 
            stringifiedData;

        if (this.state.transactionVisual) {
            return (
                <div>
                    {
                        data.map(transaction => (
                            <div key={ transaction.id }>
                                <hr />
                                <Transaction transaction={ transaction } />
                            </div>
                        ))
                    }

                    <br />

                    <Button 
                        bsStyle="danger" 
                        bsSize="small" 
                        onClick={ this.transactionToggle }> 
                        -
                    </Button>
                    
                </div>
            )
        }

        return  (
            <div>
                Data: { dataVisual }
                <Button 
                    bsStyle="danger" 
                    bsSize="small" 
                    onClick={ this.transactionToggle }> 
                    +
                </Button>
            </div> 
        ); 
    }

    render () {

        const {
            timestamp,
            individualHash,
        } = this.props.block;
        const individualHashVisual = `${individualHash.substring(0, 15)}~`;


        return (
            <div className="Block">
                <div>
                    Block Hash: { individualHashVisual }
                </div> 

                <br />

                <div> 
                    Timestamp: { new Date(timestamp).toLocaleString() }
                </div>

                {this.transactionVisual}
            </div>
        )

    }
};

export default Block
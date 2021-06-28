import React, { Component } from "react";

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

        return  <div>
                    Data: { dataVisual }
                </div>  
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
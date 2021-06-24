import React, { Component } from "react";

class Block extends Component {
    render () {
        const {
            timestamp,
            individualHash,
            data
        } = this.props.block;
        const individualHashVisual = `${individualHash.substring(0, 15)}~`;

        const stringifiedData = JSON.stringify(data);
        const dataVisual = stringifiedData.length > 42 ? `${stringifiedData.substring(0, 42)}` : stringifiedData;


        return (
            <div className="Block">
                <div>
                    Block Hash: { individualHashVisual }
                </div> 

                <br />

                <div> 
                    Timestamp: { new Date(timestamp).toLocaleString() }
                </div>

                <div>
                    Data: { dataVisual }
                </div>
            </div>
        )

    }
};

export default Block
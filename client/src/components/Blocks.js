import React, { Component } from "react";
import { Link } from "react-router-dom";
import Block from "./Block";

class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        fetch ("http://localhost:3000/api/blocks")
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render() {

        console.log("this.state", this.state);

        return(
            <div>
                <div>
                    <Link to="/">
                        My Wallet
                    </Link>
                </div>
                <h2>
                    Block scanner
                </h2>

                {
                    this.state.blocks.map(block => {
                        return (
                            <Block key={ block.individualHash } block={ block } />
                        )
                    })
                }

            </div>
        );
    }
}

export default Blocks;
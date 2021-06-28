import React from "react";

const Transaction = ({ transaction }) => {
    const { input, outputMap } = transaction;
    const recipient = Object.keys(outputMap);

    return (
        <div className="Transaction-Field">
            <div>
                From: { `${ input.address.substring(0, 20) }~` } | 
                Balance: { input.amount }
            </div>

            {
                recipient.map(recipient => {
                    return (
                        <div key={ recipient }>
                            
                            To: { `${ recipient.substring(0, 20) }~` } | 
                            Amount Sent: { outputMap[recipient] }

                        </div>
                    )
                })
            }

        </div>
    )
};

export default Transaction;
const crypto = require("crypto");

// Create the hashing function with a spread operator
const hashing = (...inputs) => {
    const hash = crypto.createHash("sha256");

    // Mapping all the inputs and returning their stringfied forms
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(" "));

    return hash.digest("hex");
};


// Export the function
module.exports = hashing;
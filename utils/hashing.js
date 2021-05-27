const crypto = require("crypto");

// Create the hashing function with a spread operator
const hashing = (...inputs) => {
    const hash = crypto.createHash("sha256");

    hash.update(inputs.sort().join(" "));

    return hash.digest("hex");
};


// Export the function
module.exports = hashing;
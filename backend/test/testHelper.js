const { assert, expect } = require('chai');

function isSameError(err, expectError) {
    assert.equal(err.errorType, expectError.errorType);
    assert.equal(err.name, expectError.name);
}

module.exports = {
    isSameError
}

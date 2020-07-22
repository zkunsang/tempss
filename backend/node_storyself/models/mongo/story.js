const SSError = require('@ss/error');

class Story {
    constructor(storyId, status) {
        this.storyId = storyId;
        this.status = status;
    }

    insertValid() {
        // if (this.storyId) throw new SSError.Model(SSError.Model.Code.insert, 'storyId empty');
        if (this.storyId) throw Error({});
        if (!this.status) throw new SSError.Model(SSError.Model.Code.insert, 'status empty');
    }
}

module.exports = Story;
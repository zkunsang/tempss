const SSError = require('@ss/error');

class Story {
    constructor({ storyId, status }) {
        this.storyId = storyId;
        this.status = status;
    }

    static typeValid(story) {
        if ( story.storyId !== undefined && typeof story.storyId !== 'string') {
            throw new SSError.Model(SSError.Model.Code.typeError, 'storyId is string');
        }

        if ( story.status !== undefined && typeof story.status !== 'number') {
            throw new SSError.Model(SSError.Model.Code.typeError, 'status is number');
        }
    }    
}

module.exports = Story;
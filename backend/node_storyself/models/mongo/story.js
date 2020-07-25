const SSError = require('@ss/error');

const Status = {
    activate: 1,
    deactivate: 0
};

class Story {
    constructor({ storyId, status }) {
        this.storyId = storyId;
        this.status = status;
        Story.typeValid(this);
        Story.valueValid(this);
    }

    static typeValid(story) {
        if (story.storyId !== undefined && typeof story.storyId !== 'string') {
            throw new SSError.Model(SSError.Model.Code.checkType, 'storyId is string');
        }

        if (story.status !== undefined && typeof story.status !== 'number') {
            throw new SSError.Model(SSError.Model.Code.checkType, 'status is number');
        }
    }

    static valueValid(story) {
        if (story.status !== Status.activate
            && story.status !== Status.deactivate) {
            throw new SSError.Model(SSError.Model.Code.validValue, 'story status 1:activate, 0: deactivate');
        }
    }
}

module.exports = Story;
module.exports.Status = Status;
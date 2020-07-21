class Story {
    constructor(storyId, status) {
        this.storyId = storyId;
        this.status = status;
    }

    insertValid() {
        if (!this.storyId) throw Error('erorr');
        if (!this.status) throw Error('erorr');
    }
}

module.exports = Story;
const ValidateUtil = require('@ss/util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const Service = require('@ss/service/Service');
const Story = require('@ss/models/mongo/Story');
const StoryDao = require('@ss/daoMongo/StoryDao');
const SSError = require('@ss/error');
const _ = require('lodash');

const Schema = {
    STORY_DAO: { key: 'storyDao', required: true, type: ValidType.OBJECT, validObject: StoryDao },
    STORY_LIST: { key: 'storyList', required: true, type: ValidType.ARRAY },
    STORY_MAP: { key: 'storyMap', required: true, type: ValidType.OBJECT },
}

class StoryService extends Service {
    constructor(storyDao) {
        super();
        this[Schema.STORY_DAO.key] = storyDao;
        this[Schema.STORY_LIST.key] = null;
        this[Schema.STORY_MAP.key] = null;

    }

    // TODO: static data memory cache system
    async ready() {
        this[Schema.STORY_LIST.key] = StoryDao.mappingList(await this[Schema.STORY_DAO.key].findAll());
        this[Schema.STORY_MAP.key] = _.keyBy(this[Schema.STORY_LIST.key], Story.Schema.STORY_ID.key);
    }

    getStoryList(storyList) {
        Service.Validate.checkEmptyArray(storyList);
        return this.filterStoryList(storyList);
    }

    filterStoryList(storyList) {
        const noExistStory = [];
        const existStory = [];

        for(const story of storyList) {
            const storyData = this[Schema.STORY_MAP.key][story];
            if(!storyData) {
                noExistStory.push(story);
            }
            existStory.push(storyData);
        }

        if (noExistStory.length > 0) {
            throw new SSError.Service(SSError.Service.Code.noExistItemList, `[${noExistStory.join(',')}] not exist story`)
        }

        return existStory;
    }
}

module.exports = StoryService;
module.exports.Schema = Schema;
const mongo = require('@ss/dbMongo');
const _ = require('lodash');

module.exports = async (ctx, next) => {
    try {
        const storyList = await mongo.getStoryList();
        storyList.map((item) => {
            delete item.code;
            delete item.summary;
            delete item._id;
        })

        const resourceList = await mongo.getStoryResourceList();

        let resourceMap = {};
        resourceList.map((item) => {
            (resourceMap[item.storyId] || 
                (resourceMap[item.storyId] = []))
                .push(item);

            delete item._id;
            delete item.storyId;
        })
        
        
        storyList.map((item) => {
            if(resourceMap[item.storyId]) {
                item.resourceList = resourceMap[item.storyId];
            }
        })

        ctx.status = 200;
        ctx.body = storyList;    
    }
    catch(err) {
        console.error(err);
    }
    
    
    await next();
}
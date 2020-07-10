const mongo = require('@ss/dbMongo');
const _ = require("lodash");

module.exports = async (ctx, next) => {
    let { insertList, updateList } = ctx.request.body;
    try {
        for(const insert of insertList) {
            await mongo.insertStoryResource(insert);
        }

        for(const update of updateList) {
            await mongo.updateStoryResource(update);
        }

    }
    catch (err) {
        console.error(err);
    }

    ctx.status = 200;
    ctx.body = {};
    await next();
}
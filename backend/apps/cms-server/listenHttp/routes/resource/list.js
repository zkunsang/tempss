const ReqResourceList = require('@ss/models/cmsController/ReqResourceList');
const ResourceDao = require('@ss/daoMongo/ResourceDao');

const DateUtil = require('@ss/util/DateUtil');

function unixTimeStampToDateString(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.unixTimeStampToDateString(dataTable, 'updateDate');
    }
}

module.exports = async (ctx, next) => {
    const reqResourceList = new ReqResourceList(ctx.request.body);
    ReqResourceList.validModel(reqResourceList);

    const resourceDao = new ResourceDao(ctx.$dbMongo);
    const resourceList = await resourceDao.findMany({ storyId: reqResourceList.getStoryId() });

    unixTimeStampToDateString(resourceList);

    ctx.status = 200;
    ctx.body.data = resourceList || [];
    await next();
}
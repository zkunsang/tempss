const CommonResourceDao = require('@ss/daoMongo/CommonResourceDao');

const DateUtil = require('@ss/util/DateUtil');

function unixTimeStampToDateString(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.unixTimeStampToDateString(dataTable, 'updateDate');
    }
}

module.exports = async (ctx, next) => {
    const commonResourceDao = new CommonResourceDao(ctx.$dbMongo);
    const commonResourceList = await commonResourceDao.findAll();

    unixTimeStampToDateString(commonResourceList);
    
    ctx.status = 200;
    ctx.body.data = commonResourceList || [];
    await next();
}
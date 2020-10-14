const ReqProductList = require('@ss/models/cmsController/ReqProductList');

const DataTableDao = require('@ss/daoMongo/DataTableDao');
const DateUtil = require('@ss/util/DateUtil');

function unixTimeStampToDateString(dataTableList) {
    for(const dataTable of dataTableList) {
        DateUtil.unixTimeStampToDateString(dataTable, 'updateDate');
    }
}
module.exports = async (ctx, next) => {
    const dataTableDao = new DataTableDao(ctx.$dbMongo);
    const dataTableList = await dataTableDao.findAll();

    unixTimeStampToDateString(dataTableList);
    
    ctx.status = 200;
    ctx.body.data = { dataTableList };
    await next();
}
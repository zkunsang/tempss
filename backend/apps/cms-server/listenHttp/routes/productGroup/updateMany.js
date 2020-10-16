const ReqProductGroupUpdateMany = require('@ss/models/cmsController/ReqProductGroupUpdateMany');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');
const ProductGroup = require('@ss/models/mongo/ProductGroup');

const ArrayUtil = require('@ss/util/ArrayUtil');
const DateUtil = require('@ss/util/DateUtil');

function dateStringToUnixTimeStamp(groupList) {
    for(const group of groupList) {
        DateUtil.dateStringToUnixTimeStamp(group, 'startDate');
        DateUtil.dateStringToUnixTimeStamp(group, 'endDate');
    }
}

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqUpdateMany = new ReqProductGroupUpdateMany(ctx.request.body);
    ReqProductGroupUpdateMany.validModel(reqUpdateMany);

    const productGroupDao = new ProductGroupDao(ctx.$dbMongo);
    const groupList = reqUpdateMany.getProductGroupList();

    dateStringToUnixTimeStamp(groupList);
    await insertGroupList(productGroupDao, groupList, updateDate)

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function insertGroupList(productGroupDao, insertList, updateDate) {
    insertList = ProductGroupDao.mappingList(insertList)
    insertList.map((item) => item.setUpdateDate(updateDate));
    await productGroupDao.insertMany(insertList);
}

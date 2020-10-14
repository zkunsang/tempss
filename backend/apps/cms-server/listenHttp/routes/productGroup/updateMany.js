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
    const beforeList = await productGroupDao.findAll();
    const groupList = reqUpdateMany.getProductGroupList();

    dateStringToUnixTimeStamp(groupList);

    const afterList = ProductGroupDao.mappingList(groupList);

    const { insertList, updateList, deleteList } = ArrayUtil.compareArrayByKey(beforeList,
        afterList,
        ProductGroup.Schema.GROUP_ID.key);

    if (deleteList.length > 0) {
        ctx.status = 200;
        const deleteGroup =
            ArrayUtil.getArrayValueByKey(deleteList, ProductGroup.Schema.GROUP_ID.key);
        ctx.body.data = { message: `delete method not allowed - ${deleteGroup.join(',')}` };
        await next();
        return;
    }

    await updateGroupList(productGroupDao, updateList, updateDate);
    await insertGroupList(productGroupDao, insertList, updateDate)

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}

async function insertGroupList(productGroupDao, insertList, updateDate) {
    insertList.map((item) => item.setUpdateDate(updateDate));
    await productGroupDao.insertMany(insertList);
}

async function updateGroupList(productGroupDao, updateList, updateDate) {
    for (const updateItem of updateList) {
        updateItem.setUpdateDate(updateDate);
        delete updateItem[ProductGroup.Schema.GROUP_ID.key];
        await productGroupDao.updateOne({ itemCategory: updateItem.getItemCategory() }, updateItem);
    }
}

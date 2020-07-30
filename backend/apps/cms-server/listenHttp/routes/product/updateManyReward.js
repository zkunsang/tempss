const ReqProductUpdateManyReward = require('@ss/models/cmsController/ReqProductUpdateManyReward');

const ProductRewardDao = require('@ss/daoMongo/ProductRewardDao');
const Item = require('@ss/models/mongo/Item');

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqProductUpdateManyReward = new ReqProductUpdateManyReward(ctx.request.body);
    ReqProductUpdateManyReward.validModel(reqProductUpdateManyReward);

    const productRewardDao = new ProductRewardDao(ctx.$dbMongo);
    const rewardList = reqProductUpdateManyReward.getRewardList();
    await productRewardDao.deleteAll();
    await insertRewardList(productRewardDao, rewardList, updateDate);
    
    ctx.status = 200;
    ctx.body = {};
    await next();
}

async function insertRewardList(productRewardDao, list, updateDate) {
    const rewardList = ProductRewardDao.mappingList(list);
    rewardList.map((item) => item.setUpdateDate(updateDate));
    
    await productRewardDao.insertMany(rewardList);
}
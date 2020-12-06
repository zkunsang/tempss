const ReqCouponCodeInsert = require('@ss/models/cmsController/ReqCouponCodeInsert');

const CouponCode = require('@ss/models/mongo/CouponCode');
const CouponCodeDao = require('@ss/daoMongo/CouponCodeDao');

module.exports = async (ctx, next) => {
    const reqCouponCodeInsert = new ReqCouponCodeInsert(ctx.request.body);
    ReqCouponCodeInsert.validModel(reqCouponCodeInsert);

    const couponId = reqCouponCodeInsert.getCouponId();
    const couponCodeList = reqCouponCodeInsert.getCouponCodeList();

    const couponCodeDao = new CouponCodeDao(ctx.$dbMongo);
    const andQuery = {"$and": [
        {couponId},
        {"$ne": {uid: null}}
    ]}
    
    const findList = await couponCodeDao.findMany(andQuery);
    await couponCodeDao.deleteMany(andQuery);



    delete couponInfo[Coupon.Schema.COUPON_ID.key];

    await couponDao.updateOne({ couponId }, couponInfo);

    const couponRewardDao = new CouponRewardDao(ctx.$dbMongo);

    await couponRewardDao.deleteMany({ couponId });
    const insertList = createCouponRewardList(reqCouponCodeInsert.getCouponRewardList(), couponId)
    await couponRewardDao.insertMany(insertList);

    ctx.status = 200;
    ctx.body.data = {};
    await next();
}
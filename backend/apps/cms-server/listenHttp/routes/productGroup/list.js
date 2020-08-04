const ReqProductGroupList = require('@ss/models/cmsController/ReqProductGroupList');
const ProductGroupDao = require('@ss/daoMongo/ProductGroupDao');

module.exports = async (ctx, next) => {
    const reqProductGroupList = new ReqProductGroupList(ctx.request.body);
    ReqProductGroupList.validModel(reqProductGroupList);

    const productGroupDao = new ProductGroupDao(ctx.$dbMongo);
    const productGroupList = await productGroupDao.findAll();

    ctx.status = 200;
    ctx.body.data = { productGroupList };
    await next();
    
}
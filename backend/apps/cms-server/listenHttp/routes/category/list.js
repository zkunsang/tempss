const ReqCategoryList = require('@ss/models/cmsController/ReqItemList');
const CategoryDao = require('@ss/daoMongo/CategoryDao');

module.exports = async (ctx, next) => {
    try {
        const reqCategoryList = new ReqCategoryList(ctx.request.body);
        ReqCategoryList.validModel(reqCategoryList);

        const categoryDao = new CategoryDao(ctx.$dbMongo);
        const categoryList = await categoryDao.findAll();

        ctx.status = 200;
        ctx.body = { categoryList };
        await next();
    }
    catch (err) {
        console.error(err);
        ctx.status = 400;
        ctx.body = { message: err.message };

        await next();
    }
}
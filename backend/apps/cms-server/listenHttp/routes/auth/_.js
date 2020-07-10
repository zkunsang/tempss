/** @param {ApiServer.HttpContext} ctx */
module.exports = async (ctx, next) => {
    await next();
};
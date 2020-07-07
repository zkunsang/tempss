/** @param {ApiServer.HttpContext} ctx */
module.exports = async (ctx, next) => {
    console.log("story _ start");
    await next();
    console.log("story _ end");
};
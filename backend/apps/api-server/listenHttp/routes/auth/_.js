/** @param {ApiServer.HttpContext} ctx */
module.exports = async (ctx, next) => {
    console.log("auth _ start");
    await next();
    console.log("auth _ end");
};
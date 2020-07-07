
module.exports = async (ctx, next) => {
    console.log("route start");
    await next();
    console.log("route end");
};
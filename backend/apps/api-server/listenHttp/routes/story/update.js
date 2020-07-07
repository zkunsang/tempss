module.exports = async (ctx, next) => {
    console.log("update");
    await next();
};
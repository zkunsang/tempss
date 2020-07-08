
module.exports = async (ctx, next) => {
    console.log(`[req]${ctx.path} -- ${JSON.stringify(ctx.request.body)}`);
    await next();
    console.log(`[res]${ctx.path} -- ${JSON.stringify(ctx.body)}`);
};
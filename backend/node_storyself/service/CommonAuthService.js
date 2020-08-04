
const dbMongo = require('@ss/dbMongo');
const dbRedis = require('@ss/dbRedis');

const ReqSession = require('@ss/models/cmsController/ReqSession');
const SessionDao = require('@ss/daoRedis/SessionDao');

const User = require('@ss/models/mongo/User');
const UserDao = require('@ss/daoMongo/UserDao');

module.exports = async (ctx, next) => {
    const reqSession = new ReqSession(ctx.request.body);
    ReqSession.validModel(reqSession);
    
    const sessionDao = new SessionDao(dbRedis);

    const sessionId = reqSession.getSessionId();
    const sessionObj = await sessionDao.get(sessionId)

    if(!sessionObj) {
        ctx.status = 401;
        ctx.body.data = {message: 'no user exist session'};
        return;
    }

    const userSessionInfo = new User(sessionObj);
    User.validModel(userSessionInfo);

    const userDao = new UserDao(dbMongo);
    const userInfo = await userDao.findOne({ uid: userSessionInfo.getUID() });

    ctx.$dbMongo = dbMongo;
    ctx.$dbRedis = dbRedis;

    ctx.$userDao = userDao;
    ctx.$userInfo = userInfo;

    await next();

    await sessionDao.update(sessionId);
};
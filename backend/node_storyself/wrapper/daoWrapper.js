const AdminDao = require('../dao/AdminDao');
const ResourceDao = require('../dao/ResourceDao');
const StoryDao = require('../dao/StoryDao');
const UserDao = require('../dao/UserDao');

const Wrapper = require('./wrapper')
const SSError = require('../error');

class DaoWrapper extends Wrapper {
    constructor() { super(); }

    init() {
        this.tryCatchWrapper(StoryDao.prototype, this.execute);
        this.tryCatchWrapper(AdminDao.prototype, this.execute);
        this.tryCatchWrapper(ResourceDao.prototype, this.execute);
        this.tryCatchWrapper(UserDao.prototype, this.execute);
    }

    async execute(fn, args) {
        try {
            return await fn.call(this, args);;
        } catch (err) {
            if(err instanceof SSError.RunTime) {
                if (err instanceof SSError.Model) { }
                if (err instanceof SSError.Dao) { }
            } else {
                throw new SSError.Dao(SSError.Dao.Code.uncaught, err);
            }

            
        }
    }
}

module.exports = DaoWrapper;
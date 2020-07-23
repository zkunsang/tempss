const AdminDao = require('../dao/AdminDao');
const ResourceDao = require('../dao/ResourceDao');
const StoryDao = require('../dao/StoryDao');
const UserDao = require('../dao/UserDao');

const Wrapper = require('./wrapper')
const SSError = require('../error');

const helper = require('@ss/helper');

class DaoWrapper extends Wrapper {
    constructor() { 
        super(); 
        this.initiated = false;
    }

    init() {
        if(this.initiated) return;
        
        this.tryCatchWrapper(StoryDao.prototype, this.execute);
        this.tryCatchWrapper(AdminDao.prototype, this.execute);
        this.tryCatchWrapper(ResourceDao.prototype, this.execute);
        this.tryCatchWrapper(UserDao.prototype, this.execute);

        this.initiated = true;
    }

    async execute(fn, ...args) {
        try {
            return await fn.call(this, ...args);;
        } catch (err) {
            if(err instanceof SSError.RunTime) {
                throw err
            } else {
                helper.slack.sendMessage(err);
                throw new SSError.Uncaught(err);
            }
        }
    }
}

module.exports = DaoWrapper;
class Admin {
    constructor(id, password) {
        this.id = id;
        this.password = password;
    }

    insertValid() {
        if (!this.id) throw Error('id error');
        if (!this.password) throw Error('password error');
    }
};

module.exports = Admin;
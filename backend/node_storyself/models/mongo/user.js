class User {
    constructor(id, password) {
        this.id = id;
        this.password = password;
    }

    insertValid() {
        if (!this.name) throw Error('name error');
        if (!this.password) throw Error('name error');
    }
};

module.exports = User;

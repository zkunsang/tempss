require('../apps/startup');
const dbMongo = null;


before(async () => {
    await require('../apps/api-server/boot/initSS')();
    // dbMongo = require('../node_storyself/dbMongo');
});

after(() => {
    
})

describe('dbMongo', () => {
    describe('create', () => {
        it('is not null', () => {

            // expect(!dbMongo).isNotNull
        })
    });
})
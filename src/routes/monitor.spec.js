const expect = require("chai").expect;
const app = require('../');
const superTest = require("supertest")(app);

describe('Test Authentication Routes', () => {
    it('Should redirect unauthenticated', (done) => {
        superTest.get('/service-watcher').end((err, res) => {
            expect(res.status).to.equal(302);
            done();
        })
    });

});



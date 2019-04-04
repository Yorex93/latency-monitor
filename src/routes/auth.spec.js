const expect = require("chai").expect;
const app = require('../');
const superTest = require("supertest")(app);

describe('Test Authentication Routes', () => {
    it('Should display login screen correctly', (done) => {
        superTest.get('/login').end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.contain("<h2>Login</h2>");
            done();
        })
    });

    it('Should display Register screen correctly', (done) => {
        superTest.get('/register').end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.contain("<h2>Register</h2>");
            done();
        })
    });

    it('Should display errors on failed login', (done) => {
        superTest.post('/login').send({ username: 'emmanueligbodudu', password: '' }).end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.contain("<span>password is not allowed to be empty</span>");
            done();
        })
    });

    it('Should display errors on failed register', (done) => {
        superTest.post('/register').send({ email: 'emmanueligbodudu', password: '' }).end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.contain("<span>password is not allowed to be empty</span>");
            expect(res.text).to.contain("<span>email must be a valid email</span>");
            expect(res.text).to.contain("<span>passwordConfirm is required</span>");
            done();
        })
    });

});



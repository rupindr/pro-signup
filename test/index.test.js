process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../demo/server');
chai.should();

const dbHandler = require('../demo/helpers/testDatabaseHandler');

chai.use(chaiHttp);

before(async () => await dbHandler.connect());
afterEach(() => dbHandler.clearDatabase());
after(() => dbHandler.disconnect());

const email = 'something@gmail.com';
const password = 'password';

describe('GET /', () => {
    it('should return 200 with non empty text', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                if (err) console.log(err);
                res.should.have.status(200);
                res.text.should.be.eql('This is some public data without authentication');
                done();
            });
    });
});

describe('POST /main/data', () => {
    it('should return redirect: true before login', (done) => {
        chai.request(server)
            .post('/main/data')
            .end((err, res) => {
                if (err) console.log(err);
                res.should.have.status(200);
                res.body.should.be.eql({ redirect: '/login' });
                done();
            });
    });
    it('should return okay + email after login', (done) => {
        chai.request(server)
            .post('/auth/register')
            .set("Connection", "keep alive")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .type("form")
            .send({ name: 'name', password, password2: password, email })
            .end((err, res) => {
                if (err) console.log(err);

                chai.request(server)
                    .post('/auth/login')
                    .set("Connection", "keep alive")
                    .set("Content-Type", "application/x-www-form-urlencoded")
                    .type("form")
                    .send({ password, email })
                    .end((err, res) => {
                        if (err) console.log(err);
                        res.should.have.status(200);
                        res.body.should.be.eql({ status: true, redirect: '/' });
                        const cookieString = res.header['set-cookie'].pop().split(';')[0];

                        chai.request(server)
                            .post('/main/data')
                            .set('Cookie', cookieString)
                            .end((err, res) => {
                                if (err) console.log(err);
                                res.should.have.status(200);
                                res.body.should.be.eql({ 'data': 'okay ' + email });
                                done();
                            });
                    });

            });
    });
});

describe('POST /auth/register', () => {
    it('should return status: true and redirect: /login', (done) => {
        chai.request(server)
            .post('/auth/register')
            .set("Connection", "keep alive")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .type("form")
            .send({ name: 'name', password, password2: password, email })
            .end((err, res) => {
                if (err) console.log(err);
                res.should.have.status(200);
                res.body.should.be.eql({ status: true, redirect: '/login' });

                done();
            });
    });
});

describe('POST /auth/login', () => {
    it('should return status: true and redirect: /', (done) => {
        chai.request(server)
            .post('/auth/register')
            .set("Connection", "keep alive")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .type("form")
            .send({ name: 'name', password, password2: password, email })
            .end((err, res) => {
                if (err) console.log(err);

                chai.request(server)
                    .post('/auth/login')
                    .set("Connection", "keep alive")
                    .set("Content-Type", "application/x-www-form-urlencoded")
                    .type("form")
                    .send({ password, email })
                    .end((err, res) => {
                        if (err) console.log(err);
                        res.should.have.status(200);
                        res.body.should.be.eql({ status: true, redirect: '/' });

                        done();
                    });

            });
    });

});
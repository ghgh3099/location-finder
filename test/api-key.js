const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/www');
const should = chai.should();
chai.use(chaiHttp);

describe("Google Api Key", () => {
    before((done) => {
        checkForDbConnect(done);
    })
    describe("GET /google-key", () => {
        it("should return google api key", (done) => {
            chai.request(server)
                .get("/api/google-key")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.data.should.equal(process.env.GOOGLE_API_KEY);
                    done();
                })
        })
    })
})

function checkForDbConnect(done) {
    const timer = setTimeout(() => {
        if (process.env.DB_CONNECTED == 'true') {
            done();
        } else {
            checkForDbConnect(done);
        }
    }, 3000)
}

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/www');
const should = chai.should();
chai.use(chaiHttp);

describe("Location", () => {
    before((done) => {
        checkForDbConnect(done);
    })
    describe("/api/location", () => {
        it("GET: should return all locations", (done) => {
            chai.request(server)
                .get("/api/location")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    done();
                })
        });

        it("DELETE should delete all locations", (done) => {
            chai.request(server)
                .get("/api/location")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    asyncEach(res.body, (loc) => {
                        const locId = loc._id;
                        return new Promise((resolve, reject) => {
                            chai.request(server)
                                .delete(`/api/location/${locId}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    if (err)
                                        return reject(err);
                                    return resolve();
                                })
                        })
                    }, (err, message) => {
                        chai.request(server)
                            .get("/api/location")
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.an("array")
                                res.body.length.should.be.equal(0);
                                done();
                            })
                    })
                })
        })

        const newLocations = [
            {Address: "Mai Dịch, Cầu Giấy", City: "Hà Nội", Country: "Việt Nam"},
            {Address: "05 HTM, Mai Dịch, Cầu Giấy", City: "Hà Nội", Country: "Việt Nam"},
            {Address: "144 Xuân Thủy, Mai Dịch, Cầu Giấy", City: "Hà Nội", Country: "Việt Nam"}
        ]
        it("POST should add new location", (done) => {
            asyncEach(newLocations, (loc) => {
                return new Promise((resolve, reject) => {
                    chai.request(server)
                        .post('/api/location')
                        .send(loc)
                        .end((err, res) => {
                            res.should.have.status(200);
                            if (err)
                                return reject(err);
                            return resolve();
                        })
                })
            }, (err, message) => {
                chai.request(server)
                    .get('/api/location')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an("array");
                        res.body.length.should.be.equal(newLocations.length);
                        done();
                    })
            })
        })

        const LOCATION_SHOULD_INCLUDE = {Address: "12 Cầu Diễn, Cầu Giấy"};
        it("PUT should update a location", (done) => {
            chai.request(server)
                .get('/api/location')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    const firstLoc = res.body[0];
                    const updateProps = LOCATION_SHOULD_INCLUDE;
                    chai.request(server)
                        .put(`/api/location/${firstLoc._id}`)
                        .send(Object.assign(firstLoc, updateProps))
                        .end((err, res) => {
                            res.should.have.status(200);
                            chai.request(server)
                                .get(`/api/location/${firstLoc._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.include(updateProps);
                                    done();
                                })
                        })
                })
        })

        it("GET should search a location", (done) => {
            const searchString = "Cầu Diễn";
            const shouldIncludeProps = LOCATION_SHOULD_INCLUDE;
            chai.request(server)
                .get('/api/location')
                .query({search: searchString})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    res.body.some(loc => loc.Address == shouldIncludeProps.Address)
                        .should.be.true;
                    done();
                })
        })
    })
})

async function asyncEach(array, iteration, end) {
    try {
        for (const item of array) {
            await iteration(item);
        }
        end(null, "done");
    } catch (e) {
        end(e, null);
    }
}

function checkForDbConnect(done) {
    const timer = setTimeout(() => {
        if (process.env.DB_CONNECTED == 'true') {
            done();
        } else {
            checkForDbConnect(done);
        }
    }, 3000)
}

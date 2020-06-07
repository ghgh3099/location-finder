const mongoose = require("mongoose");
const config = require('./config');

const M_HOST = config.mongo.host;
const M_PORT = config.mongo.port;
const M_DBNAME = config.mongo.database;
const M_USERNAME = config.mongo.user;
const M_PASSWORD = config.mongo.pass;
const M_AUTHSOURCE = config.mongo.authSource

// const uri = `mongodb://${M_HOST}:${M_PORT}/${M_DBNAME}`;
const uri = `mongodb://${M_HOST}:${M_PORT}/${M_DBNAME}`;
const mongooseOptions = {
        useNewUrlParser: true,
        authSource: M_AUTHSOURCE,
        user: M_USERNAME,
        pass: M_PASSWORD
    }
if (!M_AUTHSOURCE || !M_AUTHSOURCE.length)
    delete mongooseOptions.authSource;

const connectToMongo = function() {
    console.log(`connecting to mongo at ${uri}`);
    mongoose
        .connect(uri, mongooseOptions)
        .then(() => {
            process.env.DB_CONNECTED = true;
        })
        .catch (error => {
            console.log(`unable to connect to to database ${uri}`);
            console.log(error.message);
            setTimeout(connectToMongo, 2000);
        })
}
connectToMongo();

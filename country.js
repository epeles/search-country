const EventEmitter = require("events").EventEmitter; 
const https = require("https");
const http = require("http");
const util = require("util");

/**
 * An EventEmitter to get a country details
 * @param country
 * @constructor
 */
function Address(country) {

    EventEmitter.call(this);
    addressEmitter = this;

    const req = https.get(`https://restcountries.eu/rest/v2/name/${country}`, res => {
        let body = "";
        if (res.statusCode !== 200 && country !== 'favicon.ico') {
            req.abort();
            addressEmitter.emit("error", new Error(`"${country}". (${http.STATUS_CODES[res.statusCode]})`));
        }

        res.on('data', chunk => {
            body += chunk; //gathering the chunk (can be a string or a buffer) to the body
            addressEmitter.emit("data", chunk); //emit the whole thing in a string
        });

        res.on('end', function() {
            if(res.statusCode === 200) {
                try {
                    let address = JSON.parse(body); //turn string data to an object
                    addressEmitter.emit("end", address); //emit the object *
                } catch (error) {
                    addressEmitter.emit("error", error);
                }
            }
        }).on("error", error => {
            addressEmitter.emit("error", error);
        });
    });
}

util.inherits(Address, EventEmitter);

module.exports = Address;
'use strict';

const request = require('request');

class RequestService {
    put(endpoint, payload) {
        return new Promise((resolve, reject) =>
            request({
                method: 'PUT',
                uri: endpoint,
                body: payload
            }, (err, response, body) => {
                if (err) reject(err);
                else resolve({ response, body });
            })
        );
    }
}

module.exports = RequestService;

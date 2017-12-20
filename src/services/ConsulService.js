'use strict';

const RequestService = require('./RequestService');

class ConsulService {
    constructor({context = null, request = null} = {}) {
        if (context === null)
            throw new Error(`context must be provided to ${this.constructor.name}`);
        
        if (request === null) this.request = new RequestService();
        else this.request = request;
        
        this.context = context;
        this.endpoint = this.createAddress();
    }

    createAddress() {
        return `http://consul.service.${this.context.env.DATA_CENTER}.consul:8500/v1/`;
    }

    updateKeyValueStore(key, value) {
        const endpoint = `${this.endpoint}kv/${key}`;
        return this.request.put(endpoint, value);
    }
}

module.exports = ConsulService;

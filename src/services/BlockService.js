'use strict';

const ConsulService = require('./ConsulService')

class BlockService {
    constructor({ key = null, consul = null } = {}) {
        if (key === null)
            throw new Error(`key must be provided to ${this.constructor.name}`);
        if (consul === null)
            throw new Error(`consul must be provided to ${this.constructor.name}`);
        this.key = key;
        this.consul = consul;
    }

    setOnInstance() {
        return this.consul.updateKeyValueStore(this.key, 'true');
    }

    setOffInstance() {
        return this.consul.updateKeyValueStore(this.key, 'false');
    }
}

module.exports = BlockService;
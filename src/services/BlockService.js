'use strict';

const ConsulService = require('./ConsulService')

function getInstanceKey(instance) {
    if (!instance.consulDataCenter)
        throw new Error(`Data center could not be determined for instance ${instance.id}. Check environment type tag.`)

    return {
        dataCenter: instance.consulDataCenter,
        key: `nodes/${instance.id}/cold-standby`
    }
}

module.exports = class {

    constructor(consulService) {
        this.consul = consulService || ConsulService
    }

    setOnInstance(instance) {
        let { key, dataCenter } = getInstanceKey(instance);
        return this.consul.updateKeyValueStore(dataCenter, key, 'true');
    }

    setOffInstance(instance) {
        let { key, dataCenter } = getInstanceKey(instance);
        return this.consul.updateKeyValueStore(dataCenter, key, 'false');
    }

};
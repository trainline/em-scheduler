'use strict';

const ConsulService = require('./ConsulService')

function getInstanceDetails(instance) {
    return {
        dataCenter: instance.consulDataCenter,
        key: `nodes/${instance.id}/cold-standby`
    }
}

function updateConsul(consul, instance, value) {
    if (!instance.consulDataCenter)
        return Promise.reject(`Data center could not be determined for instance ${instance.id}. Check environment type tag.`)

    let { dataCenter, key } = getInstanceDetails(instance);
    return consul.updateKeyValueStore(dataCenter, key, value);
}

module.exports = class {

    constructor(consulService) {
        this.consul = consulService || new ConsulService()
    }

    setOnInstance(instance) {
        return updateConsul(this.consul, instance, 'true')
    }

    setOffInstance(instance) {
        return updateConsul(this.consul, instance, 'false')
    }

};
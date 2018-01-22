'use strict';

const consul = require('./ConsulService')

function getInstanceKey(instance) {
    return `nodes/${instance.id}/cold-standby`;
}

module.exports = {
    setOnInstance: instance => {
        let key = getInstanceKey(instance);
        return consul.updateKeyValueStore(instance.consulDataCenter, key, 'true');
    },

    setOffInstance: instance => {
        let key = getInstanceKey(instance);
        return consul.updateKeyValueStore(instance.consulDataCenter, key, 'false');
    }
};
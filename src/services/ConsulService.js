'use strict';

const request = require('request-promise');

function createAddress(dataCenter, key) {
  return `http://consul.service.${dataCenter}.consul:8500/v1/kv/${key}`;
}

function put(endpoint, payload) {
  return request({
    method: 'PUT',
    uri: endpoint,
    body: payload
  });
}

module.exports = {
  updateKeyValueStore: (dataCenter, key, value) => {
    let endpoint = createAddress(dataCenter, key);
    return put(endpoint, value);
  }
};

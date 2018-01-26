'use strict';

const rp = require('request-promise');

module.exports = class {

  constructor(requestService) {
    this.request = requestService || rp
  }

  updateKeyValueStore(dataCenter, key, value) {
    let endpoint = `http://consul.service.${dataCenter}.consul:8500/v1/kv/${key}`;
    return this.request.put({ url: endpoint, body: value });
  }

};

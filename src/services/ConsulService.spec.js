let ConsulService = require('./ConsulService')
let assert = require('assert')

describe('consul service', () => {

  let consul;

  let mockRequestService = {
    put: val => Promise.resolve(val)
  };

  beforeEach(() => consul = new ConsulService(mockRequestService))

  it('should something', async () => {
    let result = await consul.updateKeyValueStore('dc', 'nodes/i-123/cold-standby', 'true');
    let expected = { url: 'http://consul.service.dc.consul:8500/v1/kv/nodes/i-123/cold-standby', body: 'true' };

    assert.deepStrictEqual(result, expected)
  });

});
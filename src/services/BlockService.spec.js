let BlockService = require('./BlockService')
let assert = require('assert')

describe('block service', () => {

  let block;

  let mockConsulService = {
    updateKeyValueStore: (dataCenter, key, value) => 
      Promise.resolve({ dataCenter, key, value })
  };

  beforeEach(() => block = new BlockService(mockConsulService))

  it('should block nodes in consul', async () => {
    let result = await block.setOnInstance({ id: 'i-123', consulDataCenter: 'dc' });
    let expected = { dataCenter: 'dc', key: 'nodes/i-123/cold-standby', value: 'true' };

    assert.deepStrictEqual(result, expected)
  });

  it('should unblock nodes in consul', async () => {
    let result = await block.setOffInstance({ id: 'i-123', consulDataCenter: 'dc' });
    let expected = { dataCenter: 'dc', key: 'nodes/i-123/cold-standby', value: 'false' };

    assert.deepStrictEqual(result, expected)
  });

  it('should error if instance dataCenter is not known', () => {
    let call = () => block.setOffInstance({ id: 'i-123', consulDataCenter: null });
    let expected = 'Data center could not be determined for instance i-123. Check environment type tag.'
    
    assert.throws(call, new RegExp(expected))
  });

});
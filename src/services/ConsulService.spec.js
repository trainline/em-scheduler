'use strict';

const assert = require('assert');
const sinon = require('sinon');
const ConsulService = require('./ConsulService');
const RequestService = require('./RequestService');

describe("ConsulService", () => {
    describe('when constructing the service', () => {
        it('should fail when constructed without a context', () => {
            assert.throws(
                () => {
                    let sut = new ConsulService();
                },
                /context must be provided to ConsulService/
            );
        });

        it('should have a default request if not given one', () => {
            let sut = new ConsulService({ context: SutMocks.createValidContext() });
            assert(sut.request instanceof RequestService);
        });
    });

    describe('when updating the key value store', () => {
        it('should make a call to the correct endpoint', () => {
            let mockRequest = SutMocks.createRequestService();
            let putSpy = sinon.spy(mockRequest, 'put');
            let key = 'keyValue';
            let value = { payload: 'values' };
            let sut = new ConsulService({
                context: SutMocks.createValidContext(),
                request: mockRequest
            });

            sut.updateKeyValueStore(key, value);

            assert(putSpy.calledWith(`${sut.endpoint}kv/${key}`, value));
        });
    });
});

class SutMocks {
    static createValidContext() {
        return {
            env: {
                DATA_CENTER: 'dc'
            }
        };
    }

    static createRequestService() {
        return {
            put() { }
        }
    }
}

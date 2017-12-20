'use strict';

const assert = require('assert');
const sinon = require('sinon');
const BlockService = require('./BlockService');

describe('BlockService', () => {
    describe('when constructing the service', () => {
        it('should fail when not given a key', () => {
            assert.throws(
                () => {
                    let sut = new BlockService({ consul: SutMocks.createConsulService() });
                },
                /key must be provided to BlockService/
            );
        });
        it('should fail when not given a consul service', () => {
            assert.throws(
                () => {
                    let sut = new BlockService({ key: 5 });
                },
                /consul must be provided to BlockService/
            );
        });
    });

    describe('when blocking an instance', () => {
        it('should make a call to the consul service to create the block', (done) => {
            let mockConsulService = SutMocks.createConsulService();
            let blockSpy = sinon.spy(mockConsulService, 'updateKeyValueStore');
            let sut = new BlockService({ key: 5, consul: mockConsulService });

            sut.setOnInstance()
                .then((result) => {
                    assert.equal(result, true);
                    assert(blockSpy.calledWith(sut.key, 'true'));
                    done();
                });
        });
    });

    describe('when unblocking an instance', () => {
        it('should make a call to the consul service to set the block to false', (done) => {
            let mockConsulService = SutMocks.createConsulService();
            let blockSpy = sinon.spy(mockConsulService, 'updateKeyValueStore');
            let sut = new BlockService({ key: 5, consul: mockConsulService });

            sut.setOffInstance()
                .then((result) => {
                    assert.equal(result, true);
                    assert(blockSpy.calledWith(sut.key, 'false'));
                    done();
                }).catch((result) => {
                    done('false');
                });

        });
    });
});

class SutMocks {
    static createConsulService() {
        return {
            updateKeyValueStore() {
                return Promise.resolve(true);
            }
        }
    }
}

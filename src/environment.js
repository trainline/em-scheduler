/* Copyright (c) Trainline Limited, 2016-2017. All rights reserved. See LICENSE.txt in the project root for license information. */
'use strict';

let co = require('co');

function getConfig(AWS, context) {
  return co(function* () {
    let LIST_SKIPPED_INSTANCES = hasValue(context.env.LIST_SKIPPED_INSTANCES, 'true');
    let WHAT_IF = hasValue(context.env.WHAT_IF, 'true');
    let ERROR_ON_FAILURE = !hasValue(context.env.ERROR_ON_FAILURE, 'false');

    return {
      em: {
        host: context.env.EM_HOST,
        credentials: {
          username: context.env.EM_USERNAME,
          password: yield decrypt(AWS, context.env.EM_PASSWORD)
        }
      },
      limitToAccounts: json(context.env.LIMIT_TO_ACCOUNTS) || [],
      limitToEnvironment: context.env.LIMIT_TO_ENVIRONMENT,
      listSkippedInstances: LIST_SKIPPED_INSTANCES,
      whatIf: WHAT_IF,
      errorOnFailure: ERROR_ON_FAILURE
    };
  })
}

function json(val) {
  return val ? JSON.parse(val) : null;
}

function decrypt(AWS, cyphertext) {
  let kms = new AWS.KMS();
  return new Promise((resolve, reject) => {
    kms.decrypt({ CiphertextBlob: new Buffer(cyphertext, 'base64') }, (err, data) => {
      if (err) reject(err);
      else resolve(data.Plaintext.toString('ascii'));
    });
  });
}

function hasValue(val, testVal) {
  return !!val && val.trim().toLowerCase() === testVal.trim().toLowerCase();
}

module.exports = { getConfig };
/* Copyright (c) Trainline Limited, 2016-2017. All rights reserved. See LICENSE.txt in the project root for license information. */
'use strict'

const guid = require('uuid');
const co = require('co');

const RateLimiter = require('./rateLimiter');

function createAWSService(AWS, context, account, logger, blockService) {
  return co(function* () {
    let awsConfig = { region: context.awsRegion };

    if (account.AccountNumber !== context.awsAccountId) {
      awsConfig.credentials = yield getCredentials();
    }

    let ec2 = new AWS.EC2(awsConfig);
    let autoscaling = new AWS.AutoScaling(awsConfig);

    let autoscalingRateLimiter = new RateLimiter(10);

    function switchInstancesOn(instances) {
      return promiseAllWithSlowFail(instances.map(instance => {
        logger.log(`Unblocking : ${instance.id}`)
        return blockService.setOffInstance(instance)
          .then(() =>
            ec2.startInstances({
              InstanceIds: [instance.id]
            }).promise()
          );
      }));
    }

    function switchInstancesOff(instances) {
      return promiseAllWithSlowFail(instances.map(instance => {
        return ec2.stopInstances({
          InstanceIds: [instance.id]
        }).promise();
      }));
    }

    function putInstancesInService(instances) {
      let tasks = instances.map(instance => {
        return () => {
          return autoscaling.exitStandby({
            AutoScalingGroupName: instance.asg,
            InstanceIds: [instance.id]
          }).promise();
        };
      });

      let promises = tasks.map(autoscalingRateLimiter.queueTask);
      return promiseAllWithSlowFail(promises);
    }

    function putInstancesInStandby(instances) {
      let tasks = instances.map(instance => {
        return () => {
          logger.log(`blocking : ${instance.id}`)
          return blockService.setOnInstance(instance)
            .then(() =>
              autoscaling.enterStandby({
                AutoScalingGroupName: instance.asg,
                InstanceIds: [instance.id],
                ShouldDecrementDesiredCapacity: true
              }).promise()
            );
        };
      });

      let promises = tasks.map(autoscalingRateLimiter.queueTask);
      return promiseAllWithSlowFail(promises);
    }

    function promiseAllWithSlowFail(promises) {
      let errors = [];

      let safePromises = promises.map(promise => {
        return promise.catch(err => {
          errors.push(err);
        });
      });

      return Promise.all(safePromises).then(results => {
        if (errors.length > 0)
          throw { message: `${errors.length} operations failed.`, errors: errors };

        return results;
      });
    }

    function getCredentials() {
      let roleArn = `arn:aws:iam::${account.AccountNumber}:role/${context.env.CHILD_ACCOUNT_ROLE_NAME}`;

      return assumeRole(roleArn).then(response =>
        new AWS.Credentials(
          response.Credentials.AccessKeyId,
          response.Credentials.SecretAccessKey,
          response.Credentials.SessionToken
        )
      );
    }

    function assumeRole(roleARN) {
      let sts = new AWS.STS();
      let params = {
        RoleArn: roleARN,
        RoleSessionName: guid.v1()
      };

      return sts.assumeRole(params).promise();
    }

    return {
      ec2: {
        switchInstancesOn,
        switchInstancesOff
      },
      autoScaling: {
        putInstancesInService,
        putInstancesInStandby
      }
    };
  });
}

module.exports = {
  create: createAWSService
};
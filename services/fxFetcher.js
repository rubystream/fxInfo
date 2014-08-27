/**
 * Provides the base Widget class...
 *
 * @module fxFetcher
 */
var CronJob = require ('cron').CronJob;

module.exports = function (context) {
  'use strict';

  var job = new CronJob({
    'cronTime' : '*/10 * * * * *',
    'onTick' : function() {
      console.log('onTick: ' + new Date().toString());
    },
    'onComplete' : function() {
      console.log('Done!');
    },
    'start' : false,
    'context' : context
  });

  return job;

};


if (module.parent === null) {
  console.log('fxFetcher cron job is starting ...');
  var job = module.exports();
  job.start();
}

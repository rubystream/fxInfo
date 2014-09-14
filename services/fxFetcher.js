/**
 * Provides the base Widget class...
 *
 * @module fxFetcher
 */
var CronJob = require('cron').CronJob;
var request = require('request');
var querystring = require('querystring');

module.exports = function(context) {
  'use strict';

  var job = new CronJob({
    'cronTime': context.cronTime,
    'onTick': function() {
      console.log('onTick: ' + new Date().toString());
      var url = 'http://download.finance.yahoo.com/d/quotes.csv?' +
        querystring.stringify({
          s: ['EURUSD=X', 'EURGBP=X', 'EURCHF=X', 'EURJPY=X'].join(','),
          f: ['s', 'n', 'd1', 't1', 'l1', 'p', 'b', 'a'].join('')
        });

      request.get(url, function(err, res, body) {
        if (err) {
          console.log(err);
        }
        if (res.statusCode === 200) {
          console.log(body);
          if (context.callback) {
            context.callback(body);
          }
        }
      });
    },
    'onComplete': function() {
      console.log('Done!');
    },
    'start': false,
    'context': context
  });

  return job;

};


if (module.parent === null) {
  console.log('fxFetcher cron job is starting ...');
  var job = module.exports();
  job.start();
}

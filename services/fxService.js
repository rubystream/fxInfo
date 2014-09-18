var _ = require('lodash'),
  csv = require('csv'),
  moment = require('moment'),
  mqtt = require('mqtt'),
  config = require('../config');

var FxService = function(context) {
  'use strict';

  var fxFetcherJob = require('./fxFetcher');

  this.job = fxFetcherJob(context);

  this.start = function() {
    this.job.start();
  };

  this.stop = function() {
    this.job.stop();
  };
};

var mqttClient = mqtt.createClient(config.maqq.port, config.maqq.url, {
  "username": config.maqq.username,
  "password": config.maqq.password
});

var context = {
  'cronTime': '*/15 * * * * *',
  'callback': function(error, data) {
    if (error) {
      console.log(error);
    } else if (data) {


      csv.parse(data, function(err, output) {
        // console.log(output);
        // the data is in following format:
        // 's', 'n', 'd1', 't1', 'l1', 'p', 'b', 'a'
        // With the following description:
        // s:  'Symbol',
        // n:  'Name',
        // d1: 'Last Trade Date',
        // t1: 'Last Trade Time',
        // l1: 'Last Trade (Price Only)',
        // p:  'Previous Close',
        // b:  'Bid',
        // a:  'Ask',
        var result = _.map(output, function(item) {
          return {
            'symbol': item[0],
            'name': item[1],
            'lastTradeDate': moment.utc(item[2], 'MM/DD/YYYY').toJSON(),
            'lastTradeTime': moment.utc(item[3], 'HH:mm').toJSON(),
            'previousClose': item[4],
            'bid': item[5],
            'ask': item[6]
          };
        });
        console.log(result);
        mqttClient.publish('fxFetcher', JSON.stringify(result));
      });
    }
  }
};


var fxService = new FxService(context);

process.on('SIGINT', function() {
  console.log('Closing up and exit!');
  fxService.stop();
  process.exit();
});

fxService.start();
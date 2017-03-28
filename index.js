'use strict';

const Worker = require('bsw');
const co = require('co');

const config = require('./config.json');
const mongodb = require('./lib/mongodb');
const Producer = require('./lib/producer');
let producer = new Producer({
	host: config.beanstalkd.host,
	port: config.beanstalkd.port,
	tube: config.beanstalkd.tube
});
const handler = require('./lib/currency-handler');
let worker = new Worker({
	host: config.beanstalkd.host,
	port: config.beanstalkd.port,
	tube: config.beanstalkd.tube,
	handler: handler
});

// it is safer to establish the connection to mongodb and producer first.
co(function* () {
	yield mongodb({
		host: config.mongodb.host
	});
	yield producer.start();
	worker.start();
}).catch((err) => {
	console.log(err.message);
});

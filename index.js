'use strict';

const Worker = require('bsw');
const co = require('co');

const config = require('./config.json');
const mongodb = require('./lib/mongodb');
const Producer = require('./lib/producer');

co(function* () {
	yield mongodb({
		host: config.mongodb.host
	});

	let producer = new Producer({
		host: config.beanstalkd.host,
		port: config.beanstalkd.port,
		tube: config.beanstalkd.tube
	});
	yield producer.start();

	let worker = new Worker({
		host: config.beanstalkd.host,
		port: config.beanstalkd.port,
		tube: config.beanstalkd.tube,
		handler: require('./lib/currency-handler')
	});
	worker.start();
}).catch((err) => {
	console.log(err.message);
});

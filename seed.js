'use strict';

const config = require('./config');
const fivebeans = require('fivebeans');

let host = config.beanstalkd.host;
let port = config.beanstalkd.port;
let tube = config.beanstalkd.tube;

let joblist = [
	{
		from: 'USD',
		to: 'HKD',
		success_count: 0,
		failure_count: 0
	},
	{
		from: 'EUR',
		to: 'HKD',
		success_count: 0,
		failure_count: 0
	},
	{
		from: 'GBP',
		to: 'HKD',
		success_count: 0,
		failure_count: 0
	},
	{
		from: 'CNY',
		to: 'HKD',
		success_count: 0,
		failure_count: 0
	}
];

let doneEmittingJobs = () => {
	console.log('We reached our completion callback. Now closing down.');
	producer.end();
	process.exit(0);
};

let continuer = (err, jobid) => {
	console.log('emitted job id: ' + jobid);
	if (joblist.length === 0) {
		return doneEmittingJobs();
	}

	return producer.put(0, 0, 60, JSON.stringify(joblist.shift()), continuer);
};

let producer = new fivebeans.client(host, port);
producer.on('connect', () => {
	producer.use(tube, (err, tname) => {
		console.log('using' + tname);
		producer.put(0, 0, 60, JSON.stringify(joblist.shift()), continuer);
	});
}).connect();

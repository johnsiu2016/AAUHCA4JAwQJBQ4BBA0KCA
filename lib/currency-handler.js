'use strict';

const config = require('../config');
const job = require('./job');
const Currency = require('./mongodb/models/currency'); // To work, it should connect to mongodb first
const XEscrapper = require('./xe-scrapper');
const Producer = require('./producer');

const scrapper = new XEscrapper();
const producer = new Producer(); // producer should connect to server first

let success_count_limit = config.job.currency.success_count_limit;
let failure_count_limit = config.job.currency.failure_count_limit;
let success_delay = config.job.currency.success_delay;
let failure_delay = config.job.currency.failure_delay;

class CurrencyHandler {
	* run(payload, job_info) {
		try {
			let data = yield scrapper.getCurrency(payload.from, payload.to);
			let currency = new Currency(data);
			yield currency.save();

			payload.success_count++;
			if (payload.success_count < success_count_limit) {
				producer.produceNewJob(success_delay, job(payload.from, payload.to, payload.success_count, payload.failure_count));
			}
			return 'success';
		} catch (err) {
			console.log(err.message);

			payload.failure_count++;
			if (payload.failure_count < failure_count_limit) {
				producer.produceNewJob(failure_delay, job(payload.from, payload.to, payload.success_count, payload.failure_count));
				return 'success';
			} else {
				return 'bury';
			}
		}
	}
}

module.exports = CurrencyHandler;

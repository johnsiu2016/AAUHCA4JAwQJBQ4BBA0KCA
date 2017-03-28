'use strict';

const fivebeans = require('fivebeans');
const bbPromise = require('bluebird');

class Producer {
	/**
	 * Create a beanstalk producer and keep the connection until the program exits.
	 * @param {object} options - option params
	 * @param {string} options.host - The host name of the beanstalk server
	 * @param {number} options.port - The port number of the beanstalk server
	 * @param {string} options.tube - The tube name which this producer uses
	 */
	constructor(options) {
		this.host = options.host;
		this.port = options.port;
		this.tube = options.tube;
		this.client = null;
		this.connected = false;
	}

	/**
	 * Create a producer instance and initial the connection.
	 * When the connection is closed, it reconnect immediately.
	 * @returns {Promise} - fulfil with tube name when succeed to connect and use the tube.
	 */
	start() {
		let _this = this;

		return new bbPromise((resolve, reject) => {
			console.log('producer: connecting');
			_this.client = new fivebeans.client(_this.host, _this.port);
			_this.client
				.on('connect', function () {
					console.log('producer: connected');
					_this.client.use(_this.tube, (err, tubename) => {
						if (err) return reject(err);
						console.log(`producer: used ${_this.tube}`);
						_this.connected = true;
						return resolve(tubename);
					});
				})
				.on('error', (err) => {
					_this.client.end();
					reject(err);
				})
				.on('close', () => {
					_this.connected = false;
					_this.client.connect();
				})
				.connect();
		});
	}

	/**
	 * Put a job in the tube.
	 * @param {number} delay - delay time in second.
	 * @param {object} data - the job payload.
	 * @returns {Promise} - fulfil with job id when the job is put.
	 */
	produceNewJob(delay, data) {
		let _this = this;

		return new bbPromise((resolve, reject) => {
			if (_this.client && _this.connected) {
				_this.client.put(fivebeans.LOWEST_PRIORITY, delay, 60, JSON.stringify(data), (err, jobid) => {
					if (err) return reject(err);
					return resolve(jobid);
				});
			} else {
				reject('[producer]error: no connection');
			}
		});
	}
}

/**
 * A wrapper that forces the Producer class to create only one instance.
 * @param {object} options - same as the Producer class constructor.
 * @returns {object} a producer instance that is the same no matter how many times you call.
 */
module.exports = function Singleton(options) {
	if (Singleton.instance) {
		return Singleton.instance;
	}
	Singleton.instance = new Producer(options);

	return Singleton.instance;
};

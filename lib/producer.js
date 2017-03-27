'use strict';

const fivebeans = require('fivebeans');
const bbPromise = require('bluebird');

class Producer {
	constructor(host, port, tube) {
		this.host = host;
		this.port = port;
		this.tube = tube;
		this.client = null;
		this.connected = false;
	}

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

module.exports = function Singleton(options) {
	if (Singleton.instance) {
		return Singleton.instance;
	}
	Singleton.instance = new Producer(options.host, options.port, options.tube);

	return Singleton.instance;
};

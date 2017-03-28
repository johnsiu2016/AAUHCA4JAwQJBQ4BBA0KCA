'use strict';

const mongoose = require('mongoose');
const bbPromise = require('bluebird');

/**
 * Initial the mongodb connection and keep the connection until the program exits.
 * When the connection is closed, it reconnect immediately.
 * @param {object} options - option params
 * @param {string} options.host - the host url of mongodb
 * @returns {Promise} - fulfil when the connection is succeeded.
 */
module.exports = (options) => {
	return new bbPromise((resolve, reject) => {
		let db = mongoose.connection;
		db.on('connecting', function () {
			console.log('mongodb: connecting');
		});
		db.on('error', function (err) {
			console.error('Error in MongoDb connection: ' + err);
			mongoose.disconnect();
			reject(err);
		});
		db.on('connected', function () {
			console.log('mongodb: connected');
			resolve();
		});
		db.once('open', function () {
			console.log('mongodb: connection open');
		});
		db.on('reconnected', function () {
			console.log('mongodb: reconnected ');
		});
		db.on('disconnected', function () {
			console.log('mongodb: disconnected ');
			mongoose.connect(options.host,
				{
					server: {
						auto_reconnect: true,
						socketOptions: {
							keepAlive: 1,
							connectTimeoutMS: 30000
						}
					},
					replset: {
						socketOptions: {
							keepAlive: 1,
							connectTimeoutMS: 30000
						}
					}
				});
		});
		mongoose.Promise = bbPromise;
		mongoose.connect(options.host, {server: {auto_reconnect: true}});
	});
};

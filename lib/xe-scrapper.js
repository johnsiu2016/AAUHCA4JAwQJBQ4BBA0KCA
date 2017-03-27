'use strict';

const xRay = require('x-ray');
const bbPromise = require('bluebird');

class XEScrapper {
	constructor() {
		this.scrapper = xRay();
	}

	getCurrency(from, to) {
		return new bbPromise((resolve, reject) => {
			this.scrapper(
				`http://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`
				, '.uccResultAmount')(
				(err, rate) => {
					if (err) {
						return reject(err);
					}

					// When submitting wrong queries to the request, it returns 0.00
					rate = Number(rate);
					if (rate === 0 || isNaN(rate)) {
						return reject(new Error('Cannot get the currency rate.'));
					}
					return resolve({
						from: from,
						to: to,
						rate: Math.round(rate * 100) / 100
					});
				});
		});
	}

}

module.exports = XEScrapper;

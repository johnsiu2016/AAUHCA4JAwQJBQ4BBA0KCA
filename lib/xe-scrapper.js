'use strict';

const xRay = require('x-ray');
const bbPromise = require('bluebird');


class XEScrapper {
	/**
	 * Create a scrapper to get data from xe.com .
	 * This class takes no params
	 * but automatically generate one x-ray instance every time when created.
	 */
	constructor() {
		this.scrapper = xRay();
	}

	/**
	 * Input two currency codes and return currency rate from xe.com .
	 * You can find the currency code here: http://www.xe.com/iso4217.php .
	 * @param {string} from - currency code where the currency rate convert from.
	 * @param {string} to - currency code where the currency rate convert to.
	 */
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

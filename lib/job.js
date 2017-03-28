'use strict';

/**
 * Create a job payload
 * @param {string} from - currency code
 * @param {string}to - currency code
 * @param {number} success_count - the no. of successful job done
 * @param {number} failure_count - the no. of failure job done
 * @returns {object} - the job payload
 */
module.exports = (from, to, success_count, failure_count) => {
	return {
		from: from,
		to: to,
		success_count: success_count,
		failure_count: failure_count
	};
};

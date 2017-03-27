'use strict';

module.exports = (from, to, success_count, failure_count) => {
	return {
		from: from,
		to: to,
		success_count: success_count,
		failure_count: failure_count
	};
};

'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

describe('XEScrapper', () => {
	const XEScrapper = require('../lib/xe-scrapper');

	describe('#getCurrency', () => {
		it('should return expected payload including currency rate with 2 decimal places', (done) => {
			// test class
			let scrapper = new XEScrapper();

			// input value
			let from = 'USD';
			let to = 'HKD';

			// expected value
			let expected = {
				from: 'USD',
				to: 'HKD',
				rate: 7.77
			};
			// The scrapper, x-ray, when it is called,
			// will return a func that accept one param: cb func with (err, data) signature.
			//
			// The following will mimic the behaviour of the original
			// but return a fake currency rate.
			sinon.stub(scrapper, 'scrapper').callsFake(() => {
				return (cb) => {
					cb(null, '7.76625');
				};
			});

			scrapper.getCurrency(from, to)
				.then((actual) => {
					let regexp = /^\d+\.\d{2}$/;
					expect(regexp.test(String(actual.rate))).to.true;
					expect(actual).to.deep.equal(expected);
					done();
				})
				.catch((err) => {});

			scrapper.scrapper.restore();
		});

		it('should throw and catch the error with wrong params', (done) => {
			let scrapper = new XEScrapper();
			let from = '123';
			let to = 'HKD';
			let resolvedCb = sinon.spy();

			// The scrapper, x-ray, when it is called,
			// will return a func that accept one param: cb func with (err, data) signature.
			//
			// The following will mimic the behaviour of the original
			// but return a fake currency rate.
			sinon.stub(scrapper, 'scrapper').callsFake(() => {
				return (cb) => {
					cb(null, '0.00'); // When submitting wrong queries to the request, it returns 0.00
				};
			});

			scrapper.getCurrency(from, to)
				.then(resolvedCb)
				.catch((err) => {
					expect(resolvedCb).to.not.be.called;
					done();
				});

			scrapper.scrapper.restore();
		});

		it('should throw and catch the error if the result is not a number', (done) => {
			let scrapper = new XEScrapper();
			let from = 'USD';
			let to = 'HKD';
			let resolvedCb = sinon.spy();

			// The scrapper, x-ray, when it is called,
			// will return a func that accept one param: cb func with (err, data) signature.
			//
			// The following will mimic the behaviour of the original
			// but return a fake currency rate.
			sinon.stub(scrapper, 'scrapper').callsFake(() => {
				return (cb) => {
					cb(null, 'I am the result with wrong selector.');
				};
			});

			scrapper.getCurrency(from, to)
				.then(resolvedCb)
				.catch((err) => {
					expect(resolvedCb).to.not.be.called;
					done();
				});

			scrapper.scrapper.restore();
		});

		it('should throw and catch the error when request cannot reach the host', (done) => {
			let scrapper = new XEScrapper();
			let from = 'USD';
			let to = 'HKD';
			let resolvedCb = sinon.spy();

			// The scrapper, x-ray, when it is called,
			// will return a func that accept one param: cb func with (err, data) signature.
			//
			// The following will mimic the behaviour of the original
			// but return a fake currency rate.
			sinon.stub(scrapper, 'scrapper').callsFake(() => {
				return (cb) => {
					cb(new Error('error: no network connection'), null);
				};
			});

			scrapper.getCurrency(from, to)
				.then(resolvedCb)
				.catch((err) => {
					expect(resolvedCb).to.not.be.called;
					done();
				});

			scrapper.scrapper.restore();
		});
	});
});

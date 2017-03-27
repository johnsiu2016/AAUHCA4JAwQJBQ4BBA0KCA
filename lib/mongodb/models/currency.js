'use strict';

const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
	from: String,
	to: String,
	rate: String
}, {timestamps: true});
const Currency = mongoose.model('Currency', currencySchema);

module.exports = Currency;

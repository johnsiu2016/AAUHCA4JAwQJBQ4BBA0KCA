# AAUHCA4JAwQJBQ4BBA0KCA
This is a beanstalk worker that can scrape and store currency rate.

This worker automatically reserves predefined job (see [Seed](#seed)), and scrapes currency rate from [xe.com](http://www.xe.com), and then it stores the rate into MongoDB.

## Requirements
requires [Node.js](https://nodejs.org/) v4+ to run.

## Installation
```
git clone https://github.com/johnsiu2016/AAUHCA4JAwQJBQ4BBA0KCA.git
```

## Quick Start
To start the worker, first install the dependencies,
```
npm install
```
then run the npm script,
```
npm run start
```

## Configuration
The configuration file can be found on ./config.json.
```
{
  "beanstalkd": {
    "host": [beanstalkd host name],
    "port": [beanstalkd port number],
    "tube": [beanstalkd tube name]
  },
  "mongodb": {
    "host": [mongodb url]
  },
  "job": {
    "currency": {
      "success_delay": [delay time in second],
      "failure_delay": [delay time in second],
      "success_count_limit": [max no. of successful job],
      "failure_count_limit": [max no. of failure job]
    }
  }
}
```

## Seed
The following is an example of the predefined job for the worker:
You can find more on ./seed.js
```
{
	from: 'USD',
	to: 'HKD',
	success_count: 0,
	failure_count: 0
}
```


## Tests
To run the test suite,
```
npm run test
```

License
----

MIT
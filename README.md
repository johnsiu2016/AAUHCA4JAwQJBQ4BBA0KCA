# AAUHCA4JAwQJBQ4BBA0KCA
This is a beanstalk worker that get currency rate from [xe.com](http://www.xe.com), and then stores it into MongoDB.

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
The following is an example of the predefined job for the worker

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

## Methodologies
A job in beanstalk can only be on of four states: "ready", "reserved", "delayed", or
"buried" (see the [protocol](https://raw.githubusercontent.com/kr/beanstalkd/master/doc/protocol.txt)). Once a job is created, the payload of the job cannot be modified.

If you want to get more info of the job, you can get a list of statistics about the states, but it is not enough as you want to know whether the job actually did the business logic, rather than it has been reserved or buried. Therefore, it is very common to add own tracking parameters each job and modify them after the reserve. e.g. How many times has the job fail.

To do that, you typically have three ways:
- Store the tracking parameters of all jobs on database, and each worker modifies them after each reserve.
- Deploy a pub/sub system, publish the info to all workers and each worker maintain all the job states in memory.
- Directly add the paramters on the job payload, delete and create a new job with modified parameters through producer connection (each consumer now associated with one additional producer connection).

The advantages of the first two is that, you don't break the convention of beanstalk worker. The role of producer and consumer is clear, and the job id is also the same after each reserve. But it is more complex.

The third way is much easier as it is self-contained but you break the convention and need to maintain two connections for each consumer (one of itself and the other is for producer).

This worker applies the third way to accomplish its tasks.

License
----

MIT
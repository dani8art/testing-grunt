/*!
registry 1.10.12, built on: 2017-01-30
Copyright (C) 2017 ISA group
http://www.isa.us.es/
http://registry.governify.io/

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version. A copy of the license has been
included with this distribution in the LICENSE file.  If not, see
<http://www.gnu.org/licenses/>.
*/


'use strict';

var jsyaml = require('js-yaml');
var fs = require('fs');
var winston = require('winston');

/**
 * Configuration module.
 * @module config
 * @requires js-yaml
 * @requires fs
 * @requires winston
 * */
// learning github flow, create brach and commit
// more commit
// testing travis
// testing travis 01
var configString = fs.readFileSync('./config/config.yaml', 'utf8');
/** Properties dynamically acquired by a YAML file. */
var config = jsyaml.safeLoad(configString)[process.env.NODE_ENV ? process.env.NODE_ENV : 'development'];

config.parallelProcess.guarantees = process.env.GUARANTEES_PARALLEL_PROCESS ? process.env.GUARANTEES_PARALLEL_PROCESS : config.parallelProcess.guarantees;
config.parallelProcess.metrics = process.env.METRICS_PARALLEL_PROCESS ? process.env.METRICS_PARALLEL_PROCESS : config.parallelProcess.metrics;

config.state = {
    logger: null,
    agreementsInProgress: []
};

module.exports = config;

module.exports.setProperty = function (propertyName, newValue) {
    this[propertyName] = newValue;
};

var logConfig = {
    levels: {
        error: 7,
        warning: 8,
        ctlAgreement: 9,
        ctlState: 9,
        agreement: 10,
        pricing: 10,
        quotas: 10,
        rates: 10,
        guarantees: 10,
        metrics: 10,
        sm: 11,
        streaming: 13,
        info: 12,
        debug: 13
    },
    colors: {
        error: 'red',
        warning: 'yellow',
        agreement: 'magenta',
        ctlAgreement: 'blue',
        ctlState: 'blue',
        pricing: 'green',
        quotas: 'green',
        rates: 'green',
        guarantees: 'green',
        metrics: 'cyan',
        sm: 'grey',
        streaming: 'green',
        info: 'white',
        debug: 'black'
    }
};

winston.emitErrs = true;

/** Logger instance with default configuration. */
module.exports.logger = new winston.Logger({
    levels: logConfig.levels,
    colors: logConfig.colors,
    transports: [
        new winston.transports.File({
            level: module.exports.loggerLevel,
            filename: 'logs.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: module.exports.loggerLevel,
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
});

/** Write info messages on logger.*/
module.exports.stream = {
    /** Print an info message on logger.
     * @param {String} message message to print
     * @param {String} encoding message enconding
     * @alias module:config.stream.write
     * */
    write: function (message, encoding) {
        module.exports.logger.info(message);
    }
};

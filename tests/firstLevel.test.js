'use strict';

var expect = require('chai').expect;
var lib = require('../app/generateChangeLog.js');

describe('First Level test', function () {
    this.timeout(10000);
    it('Execute', (done) => {

        lib.updateChangelog('dani8art', 'testing-grunt', done);

    });
});

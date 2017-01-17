'use strict';

var request = require('request'),
    promise = require('bluebird');


module.exports.updateChangelog = function (user, repository, callback) {

    var changelog = {};

    var milestonesUrl = "https://api.github.com/repos/" + user + "/" + repository + "/milestones";
    console.log(milestonesUrl);
    console.log(process.env["GITHUB_ACCESS_TOKEN"]);

    request.get(milestonesUrl, {
        'auth': {
            'user': user,
            'pass': process.env["GITHUB_ACCESS_TOKEN"],
            'sendImmediately': false
        },
        headers: {
            'User-Agent': 'request'
        }
    }, (err, res, body) => {

        if (!err && res.statusCode === 200) {
            console.log(body); // Show the HTML for the Google homepage.
            callback();
        } else {
            console.log(err);
            console.log(res.statusCode);
            callback();
        }

    });
};

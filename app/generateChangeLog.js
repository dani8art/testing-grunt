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

var request = require('request'),
    promise = require('bluebird');

//testing [ci skip]
module.exports.updateChangelog = function (user, repository, version, callback) {

    var milestonesUrl = "https://api.github.com/repos/" + user + "/" + repository + "/milestones";
    console.log('getting milestones from url: \n' + milestonesUrl);


    console.log('sending request.');
    request.get(milestonesUrl, {
        'auth': {
            'user': user,
            'pass': process.env.GITHUB_ACCESS_TOKEN,
            'sendImmediately': false
        },
        headers: {
            'User-Agent': 'request'
        },
        json: true
    }, (err, res, body) => {
        console.log('receiving request.');
        if (!err && res.statusCode === 200) {
            //console.log(body); // Show the HTML for the Google homepage.
            console.log('200 OK.');
            var milestones = body;
            console.log('getting issues.');
            promise.each(milestones, (milestone) => {
                return new promise((resolve, reject) => {
                    //do request for issues
                    var issuesUrl = "https://api.github.com/repos/" + user + "/" + repository + "/issues?milestone=" + milestone.number;
                    console.log('getting issues from url: \n' + issuesUrl);
                    console.log('sending request.');
                    request.get(issuesUrl, {
                        'auth': {
                            'user': user,
                            'pass': process.env.GITHUB_ACCESS_TOKEN,
                            'sendImmediately': false
                        },
                        headers: {
                            'User-Agent': 'request'
                        },
                        json: true
                    }, (err, res, body) => {
                        console.log('receiving request.');
                        if (!err && res.statusCode === 200) {
                            console.log('200 OK.');
                            // console.log("ISSUES");
                            // console.log(body);
                            milestone.issues = body;
                            resolve();
                        } else {
                            console.log('issues request error.');
                            if (err) {
                                reject(err.toString());
                            } else {
                                reject(res.statusCode);
                            }
                        }
                    });
                });

                // .then((success) => {
                //     //one milestone success
                // }, (error) => {
                //     //one milestone error
                // })
            }).then((success) => {
                //all milestones success
                console.log('All milestones has been requested successfully.');
                console.log('Filtering by current milestone. ' + version);
                var currentMilestone = milestones.filter((element) => {
                    return element.title === version;
                });

                //console.log(currentMilestone[0].issues);

                if (!currentMilestone || currentMilestone.length === 0) {
                    console.log('Not found milestone in github with title: ' + version);
                    callback(null);
                } else {
                    console.log('Building milestone string');
                    var milestone = currentMilestone[0];
                    var now = new Date();
                    var stringChangelog = "### " + milestone.title + ' - ' + now.getUTCFullYear() + '-' + now.getUTCMonth() + 1 + '-' + now.getUTCDate() + '\n\n';

                    milestone.issues.forEach((element) => {
                        stringChangelog += '- [#' + element.number + '](' + element.html_url + ') - ' + element.title + '\n\n';
                    });
                    //console.log(stringChangelog);
                    console.log(stringChangelog);
                    console.log('Resolving promise');
                    callback(stringChangelog);
                }
            }, (error) => {
                //global errors
                console.log('Some error has ocurred ' + error.toString());
                callback(error);
            });
        } else {
            console.log("milestones request has been failed.");
            console.log(res.statusCode);
            callback();
        }
    });
};

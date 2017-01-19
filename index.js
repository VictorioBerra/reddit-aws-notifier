#!/usr/bin/env node

var bhttp = require("bhttp");
var winston = require("winston");
var Promise = require("bluebird");
var AWS = require("aws-sdk");
var format = require("util").format;

var argv = require('yargs')
    .options(require('./lib/options.js'))
    .config()
    .usage('Search subreddits for an expression, and send an AWS SNS notification for hits.')
    .example('$0 -subreddit="aww" -expression="doggo" 22')
    .argv;

var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({
            filename: argv.logfile
        })
    ]
});

var notificationCount = 0;

var knex = require("knex")(require(argv.knexfile)[process.env.NODE_ENV || 'development']);

AWS.config.setPromisesDependency(require('bluebird'));
var sns = new AWS.SNS({
    region: argv.awsregion
});

setTimeout(function() {
    knex.migrate.latest().then(function() {
        var targetJsonURI = format('https://www.reddit.com/r/%s/%s/.json', argv.subreddit, argv.type);
        logger.info('Requesting posts from ' + targetJsonURI);
        bhttp.get(targetJsonURI).then(function(response) {
                return Promise.each(response.body.data.children, function(post) {
                    post = post.data;
                    var expression = new RegExp(argv.expression, argv.expressionOptions);

                    var titleHit = argv.title && post.title.match(expression) != null;
                    var selfTextHit = argv.selftext && post.title.match(expression) != null;
                    var authorHit = argv.author && post.title.match(expression) != null;

                    if (titleHit || selfTextHit || authorHit) {
                        var postUrl = format('https://redd.it/%s', post.id);
                        logger.info(format('Matches found in: %s%s%s. %s',
                            (titleHit ? 'Title ' : ''),
                            (selfTextHit ? 'Selftext ' : ''),
                            (authorHit ? 'Author ' : ''),
                            postUrl));
                            
                        return knex('posts').where({
                                id: post.id
                            }).count()
                            .then(isHit)
                            .then(function(alreadyNotified) {
                                if (!alreadyNotified) {
                                    if (!argv.notify || notificationCount > argv.threshold) {
                                        logger.info('Skipping notifications: supressed via commandline or threshold met.');
                                        return insertPost(post.id, new Date(), '', '');
                                    }
                                    else {
                                        var notificationMessage = format('%s %s', post.title, postUrl);
                                        logger.info('Notifying. ' + notificationMessage);
                                        return sns.publish({
                                            Message: notificationMessage,
                                            TopicArn: argv.topicarn
                                        }).promise().then(function(snsResponse) {
                                            notificationCount++;
                                            return insertPost(post.id, new Date(), snsResponse.MessageId, snsResponse.ResponseMetadata.RequestId);
                                        });
                                    }
                                } else {
                                    logger.info('Skipping notifications: already notified.');
                                }
                            });
                    }
                });
            })
            .catch(function(err) {
                logger.error(err);
            });
    });
}, 3000);

function insertPost(postId, createdAt, requestId, messageId) {
    return knex('posts').insert({
        id: postId,
        messageId: messageId,
        RequestId: requestId,
        created_at: createdAt
    });
}

function isHit(count) {
    return count[0]['count(*)'] > 0;
}

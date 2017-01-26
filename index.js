#!/usr/bin/env node

var _ = require("lodash");
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

var loggerTransports = [
    new(winston.transports.Console)()
];

if (argv.logfile) {
    new(winston.transports.File)({
        filename: argv.logfile
    })
}

var logger = new(winston.Logger)({
    transports: loggerTransports
});

var notificationCount = 0;
var requestCount = 0;

var knex = require("knex")(require(argv.knexfile)[process.env.NODE_ENV || 'development']);

AWS.config.setPromisesDependency(require('bluebird'));
if (!argv.nofity) {
    var sns = new AWS.SNS({
        region: argv.awsregion
    });
}

knex.migrate.latest().then(function() {
    execute();
});

function execute(lastPostId) {

    var targetJsonURI = format('https://www.reddit.com/r/%s/%s/.json', argv.subreddit, argv.type);
    if (lastPostId) {
        var count = 25 * requestCount;
        targetJsonURI += format('?count=%s&after=t3_%s', count, lastPostId);
    }

    setTimeout(function() {
        return bhttp.get(targetJsonURI)
            .then(function(response) {
                requestCount++;
                logger.info('Requesting posts from ' + targetJsonURI);
                bhttp.get(targetJsonURI).then(function(response) {
                        return Promise.each(response.body.data.children, function(post) {

                            var expression = new RegExp(argv.expression, argv.expressionOptions);

                            var titleHit = argv.title && post.data.title.match(expression) != null;
                            var selfTextHit = argv.selftext && post.data.selftext.match(expression) != null;
                            var authorHit = argv.author && post.data.author.match(expression) != null;

                            if (titleHit || selfTextHit || authorHit) {
                                post.data.shortUrl = format('https://redd.it/%s', post.data.id);
                                logger.info(format('Matches found in: %s%s%s. %s',
                                    (titleHit ? 'Title ' : ''),
                                    (selfTextHit ? 'Selftext ' : ''),
                                    (authorHit ? 'Author ' : ''),
                                    post.data.shortUrl));

                                return knex('posts').where({
                                        id: post.data.id
                                    }).count()
                                    .then(isHit)
                                    .then(function(alreadyNotified) {
                                        if (!alreadyNotified) {
                                            if (!argv.notify || notificationCount > argv.threshold) {
                                                logger.info('Skipping notifications: supressed via commandline or threshold met.');
                                                return insertPost(post.data.id, new Date(), '', '');
                                            }
                                            else {
                                                var compiled = _.template(argv.template);
                                                var notificationMessage = compiled(post);
                                                logger.info('Notifying. Message: ' + notificationMessage);
                                                return sns.publish({
                                                    Message: notificationMessage,
                                                    TopicArn: argv.topicarn
                                                }).promise().then(function(snsResponse) {
                                                    notificationCount++;
                                                    return insertPost(post.data.id, new Date(), snsResponse.MessageId, snsResponse.ResponseMetadata.RequestId);
                                                });
                                            }
                                        }
                                        else {
                                            logger.info('Skipping notifications: already notified.');
                                        }
                                    });
                            }
                        })
                    })
                    .then(function() {
                        if(requestCount < argv.traverse){
                            logger.info('Requesting page ' + (requestCount + 1));
                            lastPostId = _.last(response.body.data.children).data.id;
                            return execute(lastPostId);
                        } else {
                            process.exit();
                        }
                    })
                    .catch(function(err) {
                        logger.error(err);
                    });
            })

    }, argv.delay);
}

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

module.exports = {
    'n': {
        alias: 'notify',
        boolean: true,
        default: false,
        describe: 'Supress notifications.'
    },
    'l': {
        alias: 'logfile',
        string: true,
        default: './logs/notification.log',
        describe: 'Logfile location.'
    },
    'k': {
        alias: 'knexfile',
        string: true,
        default: './knexfile.js',
        describe: 'Knex database configuration file, environment variable format required.'
    },
    't': {
        alias: 'threshold',
        number: true,
        default: 10,
        describe: 'Stop notifications after the 10th one.'
    },
    's': {
        alias: 'subreddit',
        string: true,
        debamd: true,
        describe: 'Subreddit to scan.'
    },
    'y': {
        alias: 'type',
        string: true,
        choices: ['hot', 'new', 'rising', 'controversial', 'top', 'gilded', 'promoted'],
        default: 'new',
        describe: 'The type of posts to search.'
    },
    'i': {
        alias: 'title',
        boolean: true,
        default: true,
        describe: 'Search post titles?'
    },
    'b': {
        alias: 'selftext',
        boolean: true,
        default: true,
        describe: 'Search self post body?'
    },
    'u': {
        alias: 'author',
        boolean: true,
        default: true,
        describe: 'Search the author name?'
    },
    'e': {
        alias: 'expression',
        string: true,
        demand: true,
        describe: 'The search expression.'
    },
    'a': {
        alias: 'topicarn',
        string: true,
        demand: true,
        describe: 'The TopicARN to publish to.'
    },
    'r': {
        alias: 'awsregion',
        string: true,
        default: 'us-east-1',
        describe: 'The AWS region of your ARN.'
    }
};
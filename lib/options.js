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
        default: false,
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
    'o': {
        alias: 'expressionOption',
        string: true,
        default: '',
        describe: 'The search expression options IE: "gi".'
    },
    'a': {
        alias: 'topicarn',
        string: true,
        describe: 'The TopicARN to publish to.'
    },
    'r': {
        alias: 'awsregion',
        string: true,
        default: 'us-east-1',
        describe: 'The AWS region of your ARN.'
    },
    'm': {
        alias: 'template',
        string: true,
        default: '"<%= data.title %>" - <%= data.shortUrl %>',
        describe: 'The message template to publish to your topic.'
    },
    'd': {
        alias: 'delay',
        number: true,
        default: 3000,
        describe: 'The delay before the script executes.'
    },
    'v': {
        alias: 'traverse',
        number: true,
        default: 1,
        describe: 'How many pages deep to go? Count is 20.'
    },
    'g': {
        alias: 'email',
        string: true,
        describe: 'An email address to send notifications to, this overrides AWS.'
    }
};

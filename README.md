## Reddit Search AWS SNS Notifier
Scan a subreddit for posts that match an expression, and be notified via AWS SNS.

### Usage
```bash
$ npm i reddit-aws-nofitier -g
$ redditnotify
```

### Notes
- if you dont specify a knexfile, it will try to use the internal development one which requires you to install sqlite3.
- Automate with [forever](https://github.com/foreverjs/forever).

### License
ISC
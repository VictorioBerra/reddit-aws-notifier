## Reddit Search AWS SNS Notifier
Scan a subreddit for posts that match an expression, and be notified via AWS SNS.

### Usage
```bash
$ npm i reddit-aws-nofitier -g
$ redditnotifier
```

### Notes
- If you dont specify a knexfile, it will try to use the internal development one which requires you to install sqlite3.
- Automate with [forever](https://github.com/foreverjs/forever).
- The template options are the same options found on Reddit JOSN data.children.

### License
ISC
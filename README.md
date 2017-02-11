## Reddit Search AWS SNS Notifier
Scan a subreddit for posts that match an expression, and be notified via AWS SNS.

### Usage
```bash
victorioberra:~/workspace (master) $ redditnotifier 
Search subreddits for an expression, and send an AWS SNS notification for hits.

Options:
  -n, --notify            Supress notifications.      [boolean] [default: false]
  -l, --logfile           Logfile location.            [string] [default: false]
  -k, --knexfile          Knex database configuration file, environment variable
                          format required.   [string] [default: "./knexfile.js"]
  -t, --threshold         Stop notifications after the 10th one.
                                                          [number] [default: 10]
  -s, --subreddit         Subreddit to scan.                            [string]
  -y, --type              The type of posts to search.
    [string] [choices: "hot", "new", "rising", "controversial", "top", "gilded",
                                                    "promoted"] [default: "new"]
  -i, --title             Search post titles?          [boolean] [default: true]
  -b, --selftext          Search self post body?       [boolean] [default: true]
  -u, --author            Search the author name?      [boolean] [default: true]
  -e, --expression        The search expression.             [string] [required]
  -o, --expressionOption  The search expression options IE: "gi".
                                                          [string] [default: ""]
  -a, --topicarn          The TopicARN to publish to.        [string] [required]
  -r, --awsregion         The AWS region of your ARN.
                                                 [string] [default: "us-east-1"]
  -m, --template          The message template to publish to your topic.
              [string] [default: "\"<%= data.title %>\" - <%= data.shortUrl %>"]
  -d, --delay             The delay before the script executes.
                                                        [number] [default: 3000]
  -v, --traverse          How many pages deep to go? Count is 20.
                                                           [number] [default: 1]
  --config                Path to JSON config file

Examples:
  index.js -subreddit="aww" -expression="doggo" -notify="true" -topicarn="arn:aws:sns:us-east-1:0000:r-subreddit-notify-app"
```

### Notes
- If you dont specify a knexfile, it will try to use the internal development one which requires you to install sqlite3.
- Automate with [forever](https://github.com/foreverjs/forever).
- The template options are the same options found on Reddit JOSN data.children.

### License
ISC
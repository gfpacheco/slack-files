# slack-files

This is a Node cli tool to help making batch operations with Slack's files.

## Features

For now the only feature is to count files grouped by any of the [Slack file](https://api.slack.com/types/file)'s fields.

## Usage

First you'll need a token.
You can generate one at the bottom of [this page](https://api.slack.com/web).

Every command returns a JSON string.
You may need a JSON processor to handle the results, I recomment [JQ](https://stedolan.github.io/jq/).

### Count

Example:

```
slack-files TOKEN count [FIELD]
```

Counts files grouped by `FIELD` (defaults to filetype).

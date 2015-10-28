# slack-files

This is a Node cli tool to help making batch operations with Slack's files.

## Features

- `count` files grouped by any field.
- `delete` files that match the given criteria.

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

Where `FIELD` can be any of the [Slack file](https://api.slack.com/types/file)'s fields.

### Delete

Example:

```
slack-files TOKEN delete [CRITERIA]
```

Delete files matching the `CRITERIA`.

Where `CRITERIA` is the string with the format: `FIELD=VALUE`.

> For now it's only possible to delete files based on ONE criteria.
> It's only because I couldn't figure out a nice way of passing multiple from the cli.

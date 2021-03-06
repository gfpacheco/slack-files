# slack-files

This is a Node cli tool to help making batch operations with Slack's files.

## Features

- `count` files grouped by any field.
- `delete` files that match the given criteria.

## Usage

First you'll need a token.
You can generate one at the bottom of [this page](https://api.slack.com/web).

Install slack-files:

    npm install -g slack-files

Every command returns a JSON string, you may (or may not) need a JSON processor
to handle the results, I recomment [jq](https://stedolan.github.io/jq/).

### Common

The `--filter FILTER` argument is a string with the format `FIELD=VALUE` and is
used to filter files before any action (count, delete, ...).

### Count

Example:

    slack-files TOKEN count [FIELD] [--filter FILTER]

Counts files grouped by `FIELD` (defaults to filetype).

Where `FIELD` can be any of the [Slack file](https://api.slack.com/types/file)'s
fields.

### Delete

Example:

    slack-files TOKEN delete [--filter FILTER]

Delete files matching the `FILTER` parameter.

> BE CAREFUL, running this command without the filter argument will delete all
> your files!

> For now it's only possible to delete files based on ONE criteria.
> It's only because I couldn't figure out a nice way of passing multiple from the cli.

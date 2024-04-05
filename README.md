# github-app-fork-test

Test repository to experiment with GitHub App authentication (server-to-server and user-to-server) to create forks and pull requests

## Setup

1. `cp env.example .env`
1. Register a GitHub App
   - give it a name such as `<your user login>-github-app-fork-test`
   - set OAuth Callback URL to http://localhost:3000/api/github/oauth/callback
   - disable webhooks
   - set permissions: `contents:write`, `pulls:write`, `adminstration:write`
   - allow install on all accounts
   - Set the credentials in `.env`

# Notes

- Creating a fork works if app is installed on user account but _not_ on upstream account
- Creating a fork _fails_ if app is _not_ installed on user account but is installed on upstream account

If the app is installed on both the source account and the target account (on all repositories), then the whole fork & pull request flow works.

## License

[ISC](LICENSE)

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

## Notes

### Forking to user account

- Creating a fork works if app is installed on user account but _not_ on upstream account
- Creating a fork _fails_ if app is _not_ installed on user account but is installed on upstream account

If the app is installed on both the source account and the target account (on all repositories), then the whole fork & pull request flow works.

### Forking into same organization

- A repository can be forked into the same organization by setting a different name
- What I couldn't figure out is how to create a pull request from a fork within the same organization

## License

[ISC](LICENSE)

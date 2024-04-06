import { createServer } from "node:http";

import { App, createNodeMiddleware, Octokit } from "octokit";

// Instantiate GitHub App
const app = new App({
  appId: process.env.APP_ID,
  privateKey: process.env.APP_PRIVATE_KEY.replace(/\\n/g, "\n"),
  oauth: {
    clientId: process.env.APP_CLIENT_ID,
    clientSecret: process.env.APP_CLIENT_SECRET,
  },
  webhooks: {
    secret: "ignore",
  },
});

const { data: appInfo } = await app.octokit.request("GET /app");
console.log("Authenticated as %s", appInfo.html_url);

// create web server for OAuth login
createServer(createNodeMiddleware(app)).listen(3000);
console.log(
  "Server started. Begin at http://localhost:3000/api/github/oauth/login"
);

// setup automation
app.oauth.on("token.created", async ({ octokit }) => {
  console.log("user-to-server token created");

  // delete fork if it exists
  await octokit.rest.repos
    .delete({
      owner: "gr2m-sandbox",
      repo: "test12-fork",
    })
    .catch(console.log);

  // create a fork
  const { data: fork } = await octokit.rest.repos.createFork({
    owner: "gr2m-sandbox",
    repo: "test12",
    default_branch_only: true,
    name: "test12-fork",
    organization: "gr2m-sandbox",
  });

  console.log("fork created: %s", fork.full_name);

  // update fork
  const owner = fork.owner.login;
  const path = Math.random().toString(36).substring(2, 7) + ".txt";
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: "test12-fork",
    path,
    content: "",
    message: "test",
  });

  console.log("https://github.com/%s/test12-fork/blob/master/%s", owner, path);

  // create pull request
  const { data: pullRequest } = await octokit.rest.pulls.create({
    owner: "gr2m-sandbox",
    repo: "test12",
    head: `${owner}/test12-test:master`,
    head_repo: "test12-test",
    base: "master",
    title: "test pull request",
    body: "test",
  });

  console.log("Pull request created: %s", pullRequest.html_url);
});

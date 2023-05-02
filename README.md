<p align="center">
  <a href="https://github.com/xataio/xataform">
    <img src="media/xataform-logo@2x.png?raw=true" alt="XataForm logo" width="300" />
  </a>
</p>

<h1 align="center">Create, share and analyse your forms</h1>
<br />

## Prerequisite

In order to run the project, you will need two accounts (free):

- A Xata account for the database - https://xata.io/
- A Clerk account for the authentication layer - https://clerk.com/

## Getting started

1. Install the dependencies: `pnpm install`
1. Initialize your database: `pnpm xata:init`
1. Add Clerk keys in `.env`: https://clerk.com/docs/nextjs/set-environment-keys
1. Start the dev server: `pnpm dev`

## Architecture

This application is build on top of Xata, Next.js, tRPC and Clerk.

### Server side

Everything is defined in `/server`:

- `/server/services`: you can find any external service. This is a simple dependency injection pattern to allow easy stubbing in our unit tests. Therefore, you don’t need any network needs to run the test and every tests will stay fast.

- `/server/routers`: All business is there, divide per module.

### Pages

A classic Next.js application pattern, every file is a page.




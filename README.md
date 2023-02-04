# XataForm

Create, share and analyse your forms with Xata.

## Getting started

1. Install the dependencies: `pnpm install`
1. Initialize your database: `pnpm xata:init`
1. Start the dev server: `pnpm dev`

## Architecture

This application is build on top of Xata, Next.js, tRPC and Clerk.

### Server side

Everything is defined in `/server`:

- `/server/services`: you can find any external service. This is a simple dependency injection pattern to allow easy stubbing in our unit tests. Therefore, you don’t need any network needs to run the test and every tests will stay fast.

- `/server/routers`: All business is there, divide per module.

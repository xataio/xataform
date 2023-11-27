:warning: **Xataform is deprecated and shuts down on December 13, 2023** :warning:

Due to the use of [object](https://xata.io/docs/concepts/data-model#object) columns in the schema, which will no longer be available after December 13 2023, Xataform stops working and will not be maintained by Xata. If you are using the object column type, please make sure to migrate away before the end date following the [migration guide](https://xata.io/docs/concepts/data-model#object-type-migration).

---

<p align="center">
  <a href="https://github.com/xataio/xataform">
    <img src="media/xataform-logo@2x.png?raw=true" alt="XataForm logo" width="300" />
  </a>
</p>

<h1 align="center">Create, share and analyse your forms</h1>

<p align="center">
  <img alt="Github Checks" src="https://badgen.net/github/checks/xataio/xataform/main"/>
  <a href="https://github.com/xataio/xataform/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/xataio/xataform"/>
  </a>
  <a href="https://xata.io/discord">
    <img alt="Discord" src="https://img.shields.io/discord/996791218879086662.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" />
  </a>
</p>

## Open Source alternative to Typeform

You can read more about the project and its motivation in our [blog post](https://xata.io/blog/xataform-is-here).

If you prefer a guided tour, [here is a loom](https://www.loom.com/share/7d24e3bc10fe4a89be601801b925d486).

To create new forms, you can use our instance at: https://xataform.com/

Or deploy your own following the instructions below.

## Prerequisite

In order to run the project, you will need two accounts (free):

- A Xata account for the database - https://xata.io/
- A Clerk account for the authentication layer - https://clerk.com/

You will also need to have [Node 18](https://nodejs.org/) installed, and [pnpm](https://pnpm.io/) is a nice to have.

## Getting started

1. Install the dependencies: `pnpm install`
2. Initialize your database: `pnpm xata:init`
3. Add Clerk keys in `.env.local`: https://clerk.com/docs/nextjs/set-environment-keys
4. At this stage, you should have 3 values in your `.env.local`

   ```env
   # Xata
   XATA_API_KEY=xau_…

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_…
   CLERK_SECRET_KEY=sk_…
   ```

   If not, please check that you picked `nextjs` in clerk.

5. Start the dev server: `pnpm dev`

## Architecture

This application is built on top of Xata, Next.js, tRPC and Clerk.

### Server side

Everything is defined in `/server`:

- `/server/services`: you can find any external service. This is a simple dependency injection pattern to allow easy stubbing in our unit tests. Therefore, you don’t need any network needs to run the test and every tests will stay fast.

- `/server/routers`: All business is there, divide per module.

### Pages

A classic Next.js application pattern, every file is a page.

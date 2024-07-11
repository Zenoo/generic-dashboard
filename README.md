[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Frameworks

> Made with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/) and [MUI](https://mui.com/), written in [Typescript](https://www.typescriptlang.org/).

## How to use

- Create a new project from this template

![](https://i.imgur.com/Hc0JsXs.png)

- Create a Personal Access Token on GitHub with the `repo` scope and add it to your repository secrets as `RELEASE_PLEASE_TOKEN`

- Every commit pushed to the `main` branch will trigger a release draft on GitHub, once you're ready to release it, merge the draft and a new release will be created

- Copy `.env.sample` to `.env` and adapt the variables

- Set the environment variable `AUTH_SECRET` with a random string generated with `openssl rand -base64 33`

- Install dependencies: `pnpm i`

- Update the database with `npx prisma migrate dev`

- Start the app with `pnpm dev`

### How to sync your database with your new Prisma schema

- Run `npx prisma migrate dev`

### How to seed your database

- Edit `prisma/seed.ts` to customize the seed data

- Run `npx prisma db seed`

## Deployment

### Vercel

*This project should deploy successfully as-is on Vercel*

- Install the [Vercel CLI](https://vercel.com/cli) and run `vercel login`

- Run `vercel link` to create a new Vercel project or link to an existing one

- Navigate to the generated `.vercel` folder, and open project.json to find the `projectID` and `orgId`

- In GitHub, set `VERCEL_PROJECT_ID` to your `projectID` and `VERCEL_ORG_ID` to your `orgID`

- Retrieve your [Vercel Access Token](https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token) and set it as the value of `VERCEL_TOKEN`

- Setup a Postgres storage on Vercel using the `DATABASE` environment variable prefix

- Add the environment variable `AUTH_SECRET` with a random string generated with `openssl rand -base64 33`

- Edit [.github/workflows/deploy-to-vercel.yml](.github/workflows/deploy-to-vercel.yml) and remove `if: false` to enable the workflow

- Your app will be deployed automatically on every version published

- (Optional) Add an environment variable `CRON_SECRET` with a random string to enable the cron jobs

### Other platforms

- Set the environment variables

- Install dependencies: `pnpm i`

- Build the app with `pnpm build`

- Start the app with `pnpm start`

## Contributing

- Fork the project

- Make sure your NodeJS version is up to date

- Copy `.env.sample` to `.env` and adapt the database URL

- Install dependencies: `pnpm i`

- Update the database with `npx prisma migrate dev`

- Start the app with `pnpm dev`

- Commit and push your changes

- Create a pull request

[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Frameworks

> Made with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/) and [MUI](https://mui.com/), written in [Typescript](https://www.typescriptlang.org/).

## How to use

- Create a new project from this template (make sure to include all branches)

![](https://i.imgur.com/Hc0JsXs.png)

- Create a Personal Access Token on GitHub with the `repo` scope and add it to your repository secrets as `RELEASE_PLEASE_TOKEN`

- Start working from the `dev` branch, the `main` branch is protected and should only be updated by the release-please action

- Copy `.env.sample` to `.env` and adapt the variables

- Install dependencies: `pnpm i`

- Update the database with `npx prisma migrate dev`

- Start the app with `pnpm dev`

### How to sync your database with your new Prisma schema

- Run `npx prisma migrate dev`

### How to seed your database

- Edit `prisma/seed.ts` to customize the seed data

- Run `npx prisma db seed`

## Deployment

*This project should deploy successfully as-is on Heroku*

- If deploying to Heroku, privision a PostgreSQL database and use the following buildpack: https://elements.heroku.com/buildpacks/mars/heroku-nextjs

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

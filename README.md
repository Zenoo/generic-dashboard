[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Frameworks

> Made with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/) and [MUI](https://mui.com/), written in [Typescript](https://www.typescriptlang.org/).

## How to use

- Create a new project from this template

![](https://i.imgur.com/Hc0JsXs.png)

- Create a Personal Access Token on GitHub with the `repo` scope and add it to your repository secrets as `RELEASE_PLEASE_TOKEN`

- Every commit pushed to the `main` branch will trigger a release draft on GitHub, once you're ready to release it, merge the draft and a new release will be created

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

### Heroku

*This project should deploy successfully as-is on Heroku*

- Provision a PostgreSQL database

- Use the following buildpack: https://elements.heroku.com/buildpacks/mars/heroku-nextjs

- Follow the instructions on https://github.com/akhileshns/heroku-deploy to configure your deployment key

- Edit [.github/workflows/deploy-to-heroku.yml](.github/workflows/deploy-to-heroku.yml) to match your app name and email, and remove `if: false` to enable the workflow

- Your app will be deployed automatically on every version published

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

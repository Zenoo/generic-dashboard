[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

## Frameworks

> Made with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/) and [MUI](https://mui.com/), written in [Typescript](https://www.typescriptlang.org/).

## How to use

- Create a new project from this template

![](https://i.imgur.com/Hc0JsXs.png)

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

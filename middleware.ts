import NextAuth from 'next-auth';
import {createI18nMiddleware} from 'next-international/middleware';
import {authConfig} from './auth.config';

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
});

export default NextAuth(authConfig).auth(req => {
  return I18nMiddleware(req);
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

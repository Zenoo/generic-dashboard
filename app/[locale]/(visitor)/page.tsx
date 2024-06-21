import Logo from '@/components/Logo';
import {Box, Container} from '@mui/material';
import LoginForm from './LoginForm';
import {getScopedI18n} from '@/locales/server';
import {I18nProviderClient} from '@/locales/client';

export async function generateMetadata() {
  const t = await getScopedI18n('login');
  return {
    title: t('login'),
  };
}

export default async function Page({
  params: {locale},
}: {
  params: {locale: string};
}) {
  return (
    <>
      <Box display="flex" flexDirection="column" height="100%">
        <Container maxWidth="sm" sx={{textAlign: 'center'}}>
          <Logo width={200} />
          <I18nProviderClient locale={locale}>
            <LoginForm />
          </I18nProviderClient>
        </Container>
      </Box>
    </>
  );
}

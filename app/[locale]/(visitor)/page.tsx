import {ClientBoundary} from '@/components/ClientBoundary';
import Logo from '@/components/Logo';
import {getScopedI18n} from '@/locales/server';
import {Box, Container} from '@mui/material';
import LoginForm from './LoginForm';

export async function generateMetadata() {
  const t = await getScopedI18n('login');
  return {
    title: t('login'),
  };
}

export default function Page({params: {locale}}: {params: {locale: string}}) {
  return (
    <>
      <Box display="flex" flexDirection="column" height="100%">
        <Container maxWidth="sm" sx={{textAlign: 'center'}}>
          <Logo width={200} />
          <ClientBoundary locale={locale}>
            <LoginForm />
          </ClientBoundary>
        </Container>
      </Box>
    </>
  );
}

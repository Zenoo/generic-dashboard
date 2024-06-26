import {ClientBoundary} from '@/components/ClientBoundary';
import {getScopedI18n} from '@/locales/server';
import {authUser} from '@/utils/server/authUserId';
import {Container, Grid} from '@mui/material';
import {redirect} from 'next/navigation';
import Profile from '../Profile';
import {ProfileDetails} from '../ProfileDetails';

export async function generateMetadata() {
  const t = await getScopedI18n('user');
  return {
    title: t('newUser'),
  };
}

export default async function Page(props: {
  params: {id: string; locale: string};
}) {
  const authedUser = await authUser();

  // Limit access to admin
  if (!authedUser.admin) {
    redirect('/app');
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={12}>
          <Profile />
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <ClientBoundary locale={props.params.locale}>
            <ProfileDetails authedUser={authedUser} />
          </ClientBoundary>
        </Grid>
      </Grid>
    </Container>
  );
}

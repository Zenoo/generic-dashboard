import {getUser} from '@/app/actions/user';
import {ClientBoundary} from '@/components/ClientBoundary';
import {getScopedI18n} from '@/locales/server';
import {authUser} from '@/utils/server/authUserId';
import {Container, Grid} from '@mui/material';
import {redirect} from 'next/navigation';
import Profile from './Profile';
import {ProfileDetails} from './ProfileDetails';

export async function generateMetadata() {
  const t = await getScopedI18n('user');
  return {
    title: t('profile'),
  };
}

export default async function Page(props: {
  params: {id: string; locale: string};
}) {
  const authedUser = await authUser();

  // Limit access to admin + self
  if (authedUser.id !== props.params.id && !authedUser.admin) {
    redirect('/app');
  }

  const {data: user} = await getUser(props.params.id, {
    id: true,
    login: true,
    admin: true,
    lang: true,
    person: {
      select: {firstName: true, lastName: true, email: true, phone: true},
    },
  });

  if (!user) return null;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item lg={4} md={6} xs={12}>
          <Profile user={user} />
        </Grid>
        <Grid item lg={8} md={6} xs={12}>
          <ClientBoundary locale={props.params.locale}>
            <ProfileDetails user={user} />
          </ClientBoundary>
        </Grid>
      </Grid>
    </Container>
  );
}

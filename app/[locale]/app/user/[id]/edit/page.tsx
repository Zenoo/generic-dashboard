import {getUser} from '@/app/actions/user';
import {I18nProviderClient} from '@/locales/client';
import {Container, Grid} from '@mui/material';
import Profile from './Profile';
import {ProfileDetails} from './ProfileDetails';
import {getScopedI18n} from '@/locales/server';

export async function generateMetadata() {
  const t = await getScopedI18n('user');
  return {
    title: t('profile'),
  };
}

export default async function Page(props: {
  params: {id: string; locale: string};
}) {
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
          <I18nProviderClient locale={props.params.locale}>
            <ProfileDetails user={user} />
          </I18nProviderClient>
        </Grid>
      </Grid>
    </Container>
  );
}

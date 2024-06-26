import {stats} from '@/app/actions/home';
import Text from '@/components/Text';
import {getScopedI18n} from '@/locales/server';
import {Euro, LocalAtm, Person2} from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';

export async function generateMetadata() {
  const t = await getScopedI18n('common');
  return {
    title: t('home'),
  };
}

const display = {
  users: Person2,
  stat2: LocalAtm,
  stat3: Euro,
} as const;

export default async function Page() {
  const t = await getScopedI18n('home');
  const data = await stats();

  return (
    <Grid container spacing={2}>
      {(['users', 'stat2', 'stat3'] as const).map(key => {
        const Icon = display[key];

        return (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Card sx={{textAlign: 'center', height: 1}}>
              <CardActionArea sx={{position: 'relative'}}>
                <CardMedia
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 1,
                    height: 1,
                    opacity: 0.1,
                    p: 1,
                  }}
                >
                  <Icon sx={{width: 1, height: 1}} />
                </CardMedia>
                <CardContent>
                  <Text h2 fontSize={40}>
                    {data[key]}
                  </Text>
                  <Text caption>{t(key)}</Text>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
      <Grid item xs={12} md={6}>
        <Card sx={{height: 1}}>
          <CardContent>
            <Text h6>Lorem ipsum</Text>
            <Text>
              Qui aliqua nulla occaecat consectetur adipisicing. Occaecat non
              exercitation veniam minim id est. Irure pariatur aute aliqua
              labore. Labore veniam qui id eiusmod incididunt excepteur magna.
              In dolore nostrud ex dolor incididunt. Sint adipisicing ea qui
              anim consectetur.
            </Text>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{height: 1}}>
          <CardContent>
            <Text h6>Dolor sit amet</Text>
            <Text>
              Ut eu ipsum et irure do irure tempor. Magna consequat consequat
              esse adipisicing sint pariatur. Sit aliqua mollit irure nostrud
              consectetur magna velit ex veniam dolore est. Labore elit tempor
              dolor ullamco do voluptate ea labore aliquip tempor minim nisi
              reprehenderit minim. Exercitation pariatur elit ad mollit id ut
              nulla velit excepteur occaecat.
            </Text>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

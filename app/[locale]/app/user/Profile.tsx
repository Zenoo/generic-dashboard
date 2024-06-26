import Text from '@/components/Text';
import {getScopedI18n} from '@/locales/server';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
} from '@mui/material';
import {Person} from '@prisma/client';
import dayjs from 'dayjs';

type ProfileProps = {
  user?: {
    person: Pick<Person, 'firstName' | 'lastName'>;
  };
};

export default async function Profile({user, ...rest}: ProfileProps) {
  const t = await getScopedI18n('user');

  return (
    <Card {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar
            sx={{
              height: 100,
              width: 100,
            }}
          />
          <Text color="textPrimary" gutterBottom h3>
            {user
              ? `${user.person.firstName} ${user.person.lastName}`
              : t('newUser')}
          </Text>
          <Text body1 color="textSecondary">
            {`${dayjs().format('HH:mm')}`}
          </Text>
        </Box>
      </CardContent>
      <Divider />
      <CardActions />
    </Card>
  );
}

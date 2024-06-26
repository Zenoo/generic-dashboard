'use client';

import {insertUser, updateProfile} from '@/app/actions/user';
import {useI18n} from '@/locales/client';
import {input} from '@/utils/client/input';
import {toastResponse} from '@/utils/client/toastResponse';
import {AuthedUser} from '@/utils/server/authUserId';
import {LoadingButton} from '@mui/lab';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import {Lang, Person, User} from '@prisma/client';
import {useActionState, useEffect} from 'react';

type ProfileDetailsProps = {
  authedUser: AuthedUser;
  user?: Pick<User, 'id' | 'login' | 'admin' | 'lang'> & {
    person: Pick<Person, 'firstName' | 'lastName' | 'email' | 'phone'>;
  };
};

export function ProfileDetails({authedUser, user}: ProfileDetailsProps) {
  const t = useI18n();
  const updateProfileWithParams = updateProfile.bind(null, user?.id || '');
  const [editState, editDispatch, editLoading] = useActionState(
    updateProfileWithParams,
    undefined
  );
  const [insertState, insertDispatch, insertLoading] = useActionState(
    insertUser,
    undefined
  );

  const state = user ? editState : insertState;
  const dispatch = user ? editDispatch : insertDispatch;
  const loading = user ? editLoading : insertLoading;

  // Handle update state
  useEffect(() => {
    if (!state) return;

    toastResponse(t, state);
  }, [state, t]);

  return (
    <form autoComplete="off" action={dispatch}>
      <Card>
        <CardHeader
          subheader={t('user.informationCanBeEdited')}
          title={user ? t('user.editUser') : t('user.newUser')}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {authedUser.admin && authedUser.id !== user?.id && (
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox name="admin" defaultChecked={user?.admin} />
                  }
                  label={t('user.giveAdminRights')}
                />
              </Grid>
            )}
            <Grid item md={6} xs={12}>
              <TextField
                {...input(t, 'user', state, 'login', 'text', {
                  required: true,
                })}
                defaultValue={user?.login}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                {...input(t, 'user', state, 'firstName', 'text', {
                  required: true,
                })}
                defaultValue={user?.person.firstName}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                {...input(t, 'user', state, 'lastName', 'text', {
                  required: true,
                })}
                defaultValue={user?.person.lastName}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                {...input(t, 'user', state, 'email', 'email', {required: true})}
                defaultValue={user?.person.email}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                {...input(t, 'user', state, 'phone', 'tel')}
                defaultValue={user?.person.phone}
                fullWidth
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                {...input(t, 'user', state, 'password', 'password', {
                  required: !user,
                })}
                fullWidth
              />
            </Grid>
            {user && (
              <Grid item md={6} xs={12}>
                <TextField
                  {...input(
                    t,
                    'user',
                    editState,
                    'passwordConfirm',
                    'password'
                  )}
                  fullWidth
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                error={!!state?.formErrors?.lang?.length}
              >
                <InputLabel>{t('user.lang')}</InputLabel>
                <Select
                  label={t('user.lang')}
                  name="lang"
                  defaultValue={user?.lang || Lang.en}
                >
                  {Object.values(Lang).map(lang => (
                    <MenuItem key={lang} value={lang}>
                      {t(`user.${lang}`)}
                    </MenuItem>
                  ))}
                </Select>
                {!!state?.formErrors?.lang?.length && (
                  <FormHelperText>
                    {state.formErrors?.lang
                      ?.map(err =>
                        (t as (m: string, p: unknown) => string)(
                          err.message,
                          err.params
                        )
                      )
                      .join('. ')}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <LoadingButton
            color="primary"
            loading={loading}
            type="submit"
            variant="contained"
          >
            {t('common.save')}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
}

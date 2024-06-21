'use client';

import {
  authenticate,
  resetPassword,
  sendPasswordResetMail,
} from '@/actions/login';
import Text from '@/components/Text';
import {useScopedI18n} from '@/locales/client';
import {input} from '@/utils/input';
import {LoadingButton} from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import {useSearchParams} from 'next/navigation';
import {MouseEvent, useActionState, useEffect, useState} from 'react';
import {toast} from 'react-toastify';

export default function LoginForm() {
  const t = useScopedI18n('login');
  const common = useScopedI18n('common');
  const [state, dispatch, loading] = useActionState(authenticate, undefined);
  const [login, setLogin] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const resetPasswordWithParams = resetPassword.bind(
    null,
    login,
    searchParams.get('code') || ''
  );
  const [resetState, resetDispatch, resetLoading] = useActionState(
    resetPasswordWithParams,
    undefined
  );

  const callResetPassword = async () => {
    const resetState = await sendPasswordResetMail(login);

    if (resetState.message) {
      toast.error(t(resetState.message));
    } else {
      toast.success(t('passwordResetMailSent'));
    }
  };

  const closeResetDialog = (_: MouseEvent, reason?: string) => {
    if (reason !== 'backdropClick') {
      setResetDialogOpen(false);
    }
  };

  useEffect(() => {
    console.log(state);
    if (state?.message) {
      toast.error(common(state.message));
    }
  }, [state, common]);

  return (
    <>
      <form action={dispatch}>
        <Box mb={3}>
          <Text color="textPrimary" h2>
            {t('signIn')}
          </Text>
          <Text body2 color="textSecondary" gutterBottom>
            {t('signInOnGD')}
          </Text>
        </Box>
        <TextField
          {...input(t, state, 'login', 'text', {required: true})}
          fullWidth
          value={login}
          onChange={e => setLogin(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          {...input(t, state, 'password', 'password', {required: true})}
          fullWidth
        />
        <Box mt={2}>
          <LoadingButton
            color="primary"
            loading={loading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            {t('signInNow')}
          </LoadingButton>
        </Box>
      </form>
      <Button size="small" sx={{mt: 2}} onClick={callResetPassword}>
        {t('passwordForgotten')}
      </Button>
      <Dialog
        open={resetDialogOpen}
        onClose={closeResetDialog}
        disableEscapeKeyDown
      >
        <form action={resetDispatch}>
          <DialogTitle>{t('changePassword')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <DialogContentText>
                {t('pleaseEnterNewPassword')}
              </DialogContentText>
              <TextField
                {...input(t, resetState, 'password', 'password', {
                  required: true,
                })}
                fullWidth
              />
              <TextField
                {...input(t, resetState, 'passwordConfirm', 'password', {
                  required: true,
                })}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeResetDialog}>{common('cancel')}</Button>
            <LoadingButton
              color="primary"
              loading={resetLoading}
              type="submit"
              variant="contained"
            >
              {common('save')}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

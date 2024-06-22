'use client';

import {
  authenticate,
  checkResetCodeValidity,
  resetPassword,
  sendPasswordResetMail,
} from '@/app/actions/login';
import Text from '@/components/Text';
import {useI18n} from '@/locales/client';
import {input} from '@/utils/client/input';
import {toastResponse} from '@/utils/client/toastResponse';
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

export default function LoginForm() {
  const t = useI18n();
  const [state, dispatch, loading] = useActionState(authenticate, undefined);
  const [login, setLogin] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const searchParams = useSearchParams();
  const resetPasswordWithParams = resetPassword.bind(
    null,
    login,
    searchParams.get('reset') || ''
  );
  const [resetState, resetDispatch, resetLoading] = useActionState(
    resetPasswordWithParams,
    undefined
  );

  const callResetPassword = async () => {
    const resetState = await sendPasswordResetMail(login);
    toastResponse(t, resetState);
  };

  const closeResetDialog = (_: MouseEvent, reason?: string) => {
    if (reason !== 'backdropClick') {
      setResetDialogOpen(false);
    }
  };

  // Display login error message
  useEffect(() => {
    if (!state) return;

    toastResponse(t, state);
  }, [state, t]);

  // Check for password reset code on load
  useEffect(() => {
    const checkCode = async () => {
      const code = searchParams.get('reset');
      const log = searchParams.get('login');
      if (code) {
        // Prefill login field
        setLogin(log || '');

        const actionState = await checkResetCodeValidity(log || '', code);
        toastResponse(t, actionState);
        if (!actionState.error) {
          // Open reset password dialog
          setResetDialogOpen(true);
        }
      }
    };
    checkCode();
  }, [searchParams, t]);

  // Handle reset password state
  useEffect(() => {
    if (!resetState) return;

    toastResponse(t, resetState);
    if (resetState.success) {
      setResetDialogOpen(false);
    }
  }, [resetState, t]);

  return (
    <>
      <form action={dispatch}>
        <Box mb={3}>
          <Text color="textPrimary" h2>
            {t('login.signIn')}
          </Text>
          <Text body2 color="textSecondary" gutterBottom>
            {t('login.signInOnGD')}
          </Text>
        </Box>
        <TextField
          {...input(t, 'login', state, 'login', 'text', {required: true})}
          fullWidth
          value={login}
          onChange={e => setLogin(e.target.value)}
          sx={{mb: 2}}
        />
        <TextField
          {...input(t, 'login', state, 'password', 'password', {
            required: true,
          })}
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
            {t('login.signInNow')}
          </LoadingButton>
        </Box>
      </form>
      <Button size="small" sx={{mt: 2}} onClick={callResetPassword}>
        {t('login.passwordForgotten')}
      </Button>
      <Dialog
        open={resetDialogOpen}
        onClose={closeResetDialog}
        disableEscapeKeyDown
      >
        <form action={resetDispatch}>
          <DialogTitle>{t('login.changePassword')}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <DialogContentText>
                {t('login.pleaseEnterNewPassword')}
              </DialogContentText>
              <TextField
                {...input(t, 'login', resetState, 'password', 'password', {
                  required: true,
                })}
                fullWidth
              />
              <TextField
                {...input(
                  t,
                  'login',
                  resetState,
                  'passwordConfirm',
                  'password',
                  {
                    required: true,
                  }
                )}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeResetDialog}>{t('common.cancel')}</Button>
            <LoadingButton
              color="primary"
              loading={resetLoading}
              type="submit"
              variant="contained"
            >
              {t('common.save')}
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

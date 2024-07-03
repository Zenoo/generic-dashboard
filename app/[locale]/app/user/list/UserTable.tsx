'use client';

import {deleteUser, getAllUsersAsCsv, getUsersTable} from '@/app/actions/user';
import TableLayout from '@/components/TableLayout';
import {useI18n} from '@/locales/client';
import {AuthedUser} from '@/utils/server/authUserId';
import {RecordObject} from '@prisma/client';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {toast} from 'react-toastify';

type UserTableProps = {
  user: AuthedUser;
};
export default function UserTable({user}: UserTableProps) {
  const t = useI18n();
  const router = useRouter();

  // Limit access to admin
  useEffect(() => {
    if (!user || !user.admin) {
      toast.error(t('server.unauthorized'));
      router.push('/app');
    }
  }, [user, router, t]);

  const mapper = (
    user: Exclude<
      Awaited<ReturnType<typeof getUsersTable>>['data'],
      undefined
    >['data'][number]
  ) => ({
    id: user.id,
    login: user.login,
    'person.firstName': user.person.firstName,
    'person.lastName': user.person.lastName,
  });

  // New user redirection
  const goToNewUser = () => {
    router.push('/app/user/add');
  };

  // User edition redirection
  const goToUserEdit = (id: string) => {
    router.push(`/app/user/${id}/edit`);
  };

  return (
    user.admin && (
      <TableLayout
        user={user}
        getter={getUsersTable}
        globalCsvExport={{
          fetcher: getAllUsersAsCsv,
          title: t('common.userList'),
        }}
        mapper={mapper}
        add={goToNewUser}
        edit={goToUserEdit}
        remove={deleteUser}
        records={RecordObject.USER}
        tableOptions={{
          columns: [
            {
              field: 'login',
              headerName: t('user.login'),
              flex: 1,
            },
            {
              field: 'person.firstName',
              headerName: t('user.firstName'),
              flex: 1,
            },
            {
              field: 'person.lastName',
              headerName: t('user.lastName'),
              flex: 1,
            },
          ],
        }}
      />
    )
  );
}

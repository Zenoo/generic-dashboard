'use client';

import {deleteUser, getAllUsersAsCsv, getUsersTable} from '@/app/actions/user';
import TableLayout from '@/components/TableLayout';
import {useI18n} from '@/locales/client';
import {AuthedUser} from '@/utils/server/authUserId';
import {useRouter} from 'next/navigation';

type UserTableProps = {
  user: AuthedUser;
};
export default function UserTable({user}: UserTableProps) {
  const t = useI18n();
  const router = useRouter();

  // Limit access to admin
  if (!user || !user.admin) {
    router.push('/app');
  }

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
  );
}

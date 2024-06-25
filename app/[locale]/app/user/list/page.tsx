import {ClientBoundary} from '@/components/ClientBoundary';
import {getScopedI18n} from '@/locales/server';
import {authUser} from '@/utils/server/authUserId';
import UserTable from './UserTable';

export async function generateMetadata() {
  const t = await getScopedI18n('common');
  return {
    title: t('userList'),
  };
}

export default async function Page({
  params: {locale},
}: {
  params: {locale: string};
}) {
  const authedUser = await authUser();

  return (
    <ClientBoundary locale={locale}>
      <UserTable user={authedUser} />
    </ClientBoundary>
  );
}

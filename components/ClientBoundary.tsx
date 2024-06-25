'use client';

import {ConfirmProvider} from '@/hooks/useConfirm';
import {LoaderProvider} from '@/hooks/useLoader';
import {I18nProviderClient} from '@/locales/client';

type ClientBoundaryProps = {
  children: React.ReactNode;
  locale: string;
};

export const ClientBoundary = ({children, locale}: ClientBoundaryProps) => {
  return (
    <I18nProviderClient locale={locale}>
      <LoaderProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </LoaderProvider>
    </I18nProviderClient>
  );
};

import { useTranslation } from 'react-i18next';

import { BridgeCard } from '~/containers';

export const Landing = () => {
  const { t } = useTranslation();

  return (
    <section>
      <h1 data-testid='boilerplate-title'>{t('HEADER.title', { appName: 'Superchain Bridge' })}</h1>

      <BridgeCard />
    </section>
  );
};
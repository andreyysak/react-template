import { Button, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/config/routes';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Stack align="center" py="xl">
      <Title order={2}>{t('errors.notFound')}</Title>
      <Button component={Link} to={ROUTES.home}>
        {t('errors.goHome')}
      </Button>
    </Stack>
  );
};

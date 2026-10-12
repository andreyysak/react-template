import { Button, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link, useRouteError } from 'react-router';
import { ROUTES } from '@/shared/config/routes';

export const ErrorPage = () => {
  const { t } = useTranslation();
  const error = useRouteError();
  const message =
    error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error)
      ? String(error.message)
      : null;

  return (
    <Stack align="center" py="xl">
      <Title order={2}>{t('errors.unexpected')}</Title>
      {import.meta.env.DEV && message && <Text c="dimmed">{message}</Text>}
      <Button component={Link} to={ROUTES.home}>
        {t('errors.goHome')}
      </Button>
    </Stack>
  );
};

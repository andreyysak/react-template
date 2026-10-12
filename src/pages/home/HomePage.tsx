import { Button, Group, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLogout, useMe } from '@/features/auth';

export const HomePage = () => {
  const { t } = useTranslation();
  const { data: user } = useMe();
  const logout = useLogout();

  return (
    <Group justify="space-between">
      <div>
        <Title order={1}>{t('home.title')}</Title>
        {user && (
          <Text c="dimmed">
            {t('welcome')}, {user.name}
          </Text>
        )}
      </div>
      <Button variant="default" onClick={logout}>
        {t('auth.logout')}
      </Button>
    </Group>
  );
};

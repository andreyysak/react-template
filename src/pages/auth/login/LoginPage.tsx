import { Container, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@/features/auth';

export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <Container size={420} py="xl">
      <Title order={2} mb="lg">
        {t('auth.title')}
      </Title>
      <LoginForm />
    </Container>
  );
};

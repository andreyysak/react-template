import { zodResolver } from '@hookform/resolvers/zod';
import { Button, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { type Location, useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { useLogin } from '../queries/auth.queries';
import { type LoginDto, loginSchema, PASSWORD_MIN_LENGTH } from '../types';

export const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? ROUTES.home;
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginDto) =>
    login.mutate(data, { onSuccess: () => navigate(from, { replace: true }) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
        <TextInput
          type="email"
          label={t('auth.email')}
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message && t(errors.email.message)}
        />
        <PasswordInput
          label={t('auth.password')}
          autoComplete="current-password"
          {...register('password')}
          error={
            errors.password?.message && t(errors.password.message, { count: PASSWORD_MIN_LENGTH })
          }
        />
        <Button type="submit" loading={login.isPending}>
          {t('auth.login')}
        </Button>
      </Stack>
    </form>
  );
};

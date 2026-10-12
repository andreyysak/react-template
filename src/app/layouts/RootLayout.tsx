import { Container } from '@mantine/core';
import { Outlet } from 'react-router';

export const RootLayout = () => (
  <Container size="lg" py="xl">
    <Outlet />
  </Container>
);

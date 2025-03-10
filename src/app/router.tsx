import { useMemo } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { paths } from '@app/config/paths';
import { default as AppRoot, ErrorBoundary as AppRootErrorBoundary } from './routes/root';

const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: paths.root.path,
      element: <AppRoot />,
      ErrorBoundary: AppRootErrorBoundary,
    },
    {
      path: paths.map.path,
      lazy: () => import('./routes/map').then(convert(queryClient)),
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert(queryClient)),
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
};

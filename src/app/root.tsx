import type { Route } from './+types/root';
import { isRouteErrorResponse, Links, Meta, Scripts, ScrollRestoration } from 'react-router';
import MainLayout from './layouts/MainLayout';
import { AppProvider } from './provider';

export const links: Route.LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: '/src/styles/reset.css',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko'>
      <head>
        <meta charSet='utf-8' />
        <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport' />
        <title>잡코리아&알바몬 맛집 지도</title>
        <script
          src='//dapi.kakao.com/v2/maps/sdk.js?appkey=3653c8e9e3393edef9436f812f6f9c88&libraries=services,clusterer'
          type='text/javascript'
        ></script>
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <MainLayout />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

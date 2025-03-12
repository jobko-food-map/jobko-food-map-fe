import { Link, Outlet } from 'react-router';
import { paths } from '@app/config/paths';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  return (
    <>
      <Link to={paths.map.getHref()}>go map</Link>
    </>
  );
};

export default AppRoot;

import BaseLink from '@app/components/BaseLink';
import { paths } from '@app/configs/paths';

const NotFoundRoute = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <BaseLink replace to={paths.root.getHref()}>
        Go to Home
      </BaseLink>
    </div>
  );
};

export default NotFoundRoute;

import { Link } from 'react-router';
import { paths } from '@app/config/paths';

const NotFoundRoute = () => {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to={paths.root.getHref()} replace>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundRoute;

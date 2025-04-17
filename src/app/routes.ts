import type { RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

/**
 * https://reactrouter.com/how-to/file-route-conventions#escaping-special-characters
 */
export default flatRoutes() satisfies RouteConfig;

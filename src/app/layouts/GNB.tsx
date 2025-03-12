import { Link } from 'react-router';
import { paths } from '@app/config/paths';

const GNB = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-red text-2xl">
        <Link to="/">Logo</Link>
      </div>
      <ul className="flex space-x-4">
        <li><Link className="text-white hover:underline" to={paths.map.getHref()}>GNB Map</Link></li>
      </ul>
    </nav>
  );
};

export default GNB;
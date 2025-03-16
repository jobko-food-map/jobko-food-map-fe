import { Link } from 'react-router';
import GoogleLoginButton from '@app/features/auth/components/google-login-button';

const GNB = () => {
  return (
    <nav className='bg-gray-800 p-4 flex justify-between items-center'>
      <div className='text-2xl text-white'>
        <Link to='/'>Logo</Link>
      </div>
      <GoogleLoginButton />
    </nav>
  );
};

export default GNB;

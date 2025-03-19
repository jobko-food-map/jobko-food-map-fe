import BaseLink from '@app/components/BaseLink';
import GoogleLoginButton from '@app/features/auth/components/google-login-button';

const GNB = () => {
  return (
    <nav className='bg-gray-800 p-4 flex justify-between items-center'>
      <div className='text-2xl text-white'>
        <BaseLink to='/'>Logo</BaseLink>
      </div>
      <GoogleLoginButton />
    </nav>
  );
};

export default GNB;

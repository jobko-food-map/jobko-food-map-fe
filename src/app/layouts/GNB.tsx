import BaseLink from '@app/components/BaseLink';
import GoogleLoginButton from '@app/features/auth/components/google-login-button';

const GNB = () => {
  return (
    <nav className='bg-food-pink-300 p-4 flex justify-between items-center'>
      <div className='text-2xl text-white'>
        <BaseLink to='/'>점메추</BaseLink>
      </div>
      <GoogleLoginButton />
    </nav>
  );
};

export default GNB;

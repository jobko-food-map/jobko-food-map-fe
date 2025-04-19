import BaseLink from '@app/components/BaseLink';
import GoogleLoginButton from '@app/features/auth/components/google-login-button';
import { useEffect, useState } from 'react';

const GNB = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-food-pink-300'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <BaseLink className='flex items-center space-x-2' to='/'>
              <span className={`text-2xl font-bold ${isScrolled ? 'text-food-pink-300' : 'text-white'}`}>점메추</span>
              <img
                alt='음식 로고'
                className='w-8 h-8 animate-bounce'
                src='https://cdn-icons-png.flaticon.com/512/3081/3081559.png'
              />
            </BaseLink>
          </div>

          <div className='flex items-center'>
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GNB;

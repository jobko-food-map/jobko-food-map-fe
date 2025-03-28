import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { clientEnv } from '@app/configs/env';
import { getUserInfoByAccessToken } from '@app/lib/auth';
import { useSessionStore } from '@app/store';
import { getUser } from '../api/user';

const CustomButton = () => {
  const { updateState, userInfo } = useSessionStore();

  const saveAccessToken = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
  };


  const loginProcess = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await getUserInfoByAccessToken(tokenResponse.access_token);
      saveAccessToken(tokenResponse.access_token);
      const loggedUserInfo = await getUser(userInfo.email);
      updateState({userInfo: loggedUserInfo});
      alert('로그인 성공');
    },
    onError: error => console.log('error', error),
  });
  return userInfo ? (<button className='bg-white text-gray-800 p-2 rounded hover:bg-gray-200'>
    {userInfo.userName}
  </button>) :(
    <button
      className='bg-white text-gray-800 p-2 rounded hover:bg-gray-200'
      type='button'
      onClick={() => loginProcess()}
    >
      Google Login
    </button>
  );
};

function GoogleLoginButton() {
  return (
    <GoogleOAuthProvider clientId={clientEnv.GOOGLE_CLIENT_ID}>
      <CustomButton />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;

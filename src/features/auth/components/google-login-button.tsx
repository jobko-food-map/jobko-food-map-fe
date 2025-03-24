import type { UserInfo } from '@app/lib/auth';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { clientEnv } from '@app/configs/env';
import { axiosClient } from '@app/lib/api-client';
import { getUserInfoByAccessToken } from '@app/lib/auth';

const CustomButton = () => {
  const joinUserInfo = async (userInfo: UserInfo) => {
    await axiosClient.post('/v1/user', {
      userId: userInfo.email,
      userName: userInfo.name,
    });
  };

  const saveAccessToken = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
  };

  const loginProcess = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await getUserInfoByAccessToken(tokenResponse.access_token);
      await joinUserInfo(userInfo);
      saveAccessToken(tokenResponse.access_token);
      alert('로그인 성공');
    },
    onError: error => console.log('error', error),
  });
  return (
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

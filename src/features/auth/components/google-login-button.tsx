import type { TokenResponse } from '@react-oauth/google';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { clientEnv } from '@app/configs/env';
import { axiosClient } from '@app/lib/api-client';

interface UserInfo {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}
const CustomButton = () => {
  const getUserInfo = async (tokenResponse: TokenResponse) => {
    const { data } = await axios.get<UserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });
    return data;
  };

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
      const userInfo = await getUserInfo(tokenResponse);
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

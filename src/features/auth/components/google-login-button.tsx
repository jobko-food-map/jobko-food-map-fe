import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { clientEnv } from '@app/configs/env';
import { getUserInfoByAccessToken } from '@app/lib/auth';
import { useSessionStore } from '@app/store';
import { postUser } from '../api/user';

const CustomButton = () => {
  const { updateState, userInfo } = useSessionStore();

  const saveAccessToken = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
  };


  const loginProcess = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await getUserInfoByAccessToken(tokenResponse.access_token);
      saveAccessToken(tokenResponse.access_token);
      const loggedUserInfo = await postUser(userInfo.email, userInfo.name);
      updateState({userInfo: loggedUserInfo});
      alert('로그인 성공');
    },
    onError: error => console.log('error', error),
  });
  return userInfo ? (<span className='text-white p-2 rounded'>
    {userInfo.userName}님 오늘 점심 뭐 드시겠어요?
  </span>) :(
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

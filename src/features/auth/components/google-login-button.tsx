import { clientEnv } from '@app/configs/env';
import { paths } from '@app/configs/paths';
import { getUserInfoByAccessToken } from '@app/lib/auth';
import { useSessionStore } from '@app/store';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router';
import { postUser } from '../api/user';

const CustomButton = () => {
  const { updateState, userInfo } = useSessionStore();

  const saveAccessToken = (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken);
  };

  const loginProcess = useGoogleLogin({
    onSuccess: async tokenResponse => {
      const userInfo = await getUserInfoByAccessToken(tokenResponse.access_token);

      // userInfo email 주소가 jobkorea.co.kr로 끝나지 않으면 로그인 실패
      if (!userInfo.email.endsWith('@jobkorea.co.kr')) {
        alert('jobkorea.co.kr 이메일로 로그인 해주세요.');
        return;
      }

      saveAccessToken(tokenResponse.access_token);
      const loggedUserInfo = await postUser(userInfo.email, userInfo.name);
      updateState({ userInfo: loggedUserInfo });
      alert('로그인 성공');
    },
    onError: error => console.log('error', error),
  });
  return userInfo ? (
    <Link className='text-white p-2 rounded' to={paths.randomFood.getHref()}>
      {userInfo.userName}님 오늘 점심 뭐 드시겠어요?
    </Link>
  ) : (
    <button
      className='bg-white text-gray-800 p-2 rounded hover:bg-gray-200'
      onClick={() => loginProcess()}
      type='button'
    >
      잡코리아 구글 로그인 ❤️
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

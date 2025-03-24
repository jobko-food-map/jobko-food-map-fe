import axios from 'axios';

export interface UserInfo {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}
// eslint-disable-next-line react-refresh/only-export-components
export const getUserInfoByAccessToken = async (accessToken: string) => {
  const { data } = await axios.get<UserInfo>('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};

export const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  try {
    const accessToken = localStorage.getItem('accessToken') ?? '';
    await getUserInfoByAccessToken(accessToken);
    return children;
  } catch {
    return null;
  }
};

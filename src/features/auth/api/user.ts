import type { UserInfo } from '@app/types/api';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@app/lib/api-client';

export const getUser = async (userId: string) => {
  const { data } = await axiosClient.get<UserInfo>(`/v1/user/${userId}`);
  return data;
};

export const postUser = async (userId: string, userName: string) => {
  const { data } = await axiosClient.post<UserInfo>('/v1/user', {userId, userName});
  return data;
};

export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ['USER', userId],
    queryFn: () => getUser(userId),
  });
};

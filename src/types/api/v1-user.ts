import type { UserInfo } from './schemas';

export interface V1UserPostRequest {
  userId: string;
  userName: string;
}

export type V1UserPostResponse = UserInfo;

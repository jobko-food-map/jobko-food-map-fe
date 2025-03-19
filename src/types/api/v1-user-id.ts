import type { UserInfo } from './schemas';

export interface V1UserIdGetParameters {
  id: number;
}

export type V1UserIdGetResponse = UserInfo;

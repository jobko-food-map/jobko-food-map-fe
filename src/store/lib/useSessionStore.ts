import { LOCAL_STORAGE_KEY } from '@app/constants';
import type { UserInfo } from '@app/types/api/schemas';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ChatSession {
  userInfo?: UserInfo;
  updateState: (userInfo: Partial<ChatSession>) => void;
}

const initialState: Omit<ChatSession, 'updateState'> = {
  userInfo: undefined,
};

export const useSessionStore = create<ChatSession>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        updateState: userInfo =>
          set(state => {
            return { ...state, ...userInfo };
          }),
      }),
      { name: LOCAL_STORAGE_KEY.FOOD_MAP_STORAGE },
    ),
  ),
);

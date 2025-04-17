import { clientEnv } from '@app/configs/env';
import type { ApiErrorResponse } from '@app/types/error';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

function createAxios(requestConfig: AxiosRequestConfig): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: requestConfig.baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const errorData: ApiErrorResponse = error.response?.data;

      return Promise.reject(errorData || error);
    },
  );

  return axiosInstance;
}

export const axiosClient = createAxios({ baseURL: clientEnv.API_URL });

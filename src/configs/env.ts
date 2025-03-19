import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    SHORT_ENV: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_ADSENSE_ID: z.string(),
    KAKAO_MAP_APP_KEY: z.string(),
  });

  const envVars = {
    API_URL: import.meta.env.VITE_APP_API_URL,
    SHORT_ENV: import.meta.env.VITE_APP_SHORT_ENV,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
    GOOGLE_ADSENSE_ID: import.meta.env.VITE_APP_GOOGLE_ADSENSE_ID,
    KAKAO_MAP_APP_KEY: import.meta.env.VITE_APP_KAKAO_MAP_APP_KEY,
  };

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
  The following variables are missing or invalid:
  ${Object.entries(parsedEnv.error.flatten().fieldErrors)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join('\n')}
  `,
    );
  }

  return parsedEnv.data ?? {};
};

export const clientEnv = createEnv();

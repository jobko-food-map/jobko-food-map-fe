import * as z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    SHORT_ENV: z.string(),
    BUILD_ID: z.string(),
  });

  const envVars = {
    API_URL: import.meta.env.VITE_APP_API_URL,
    SHORT_ENV: import.meta.env.VITE_APP_SHORT_ENV,
    BUILD_ID: import.meta.env.VITE_APP_BUILD_ID,
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

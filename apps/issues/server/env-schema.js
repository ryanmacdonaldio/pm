const { z } = require('zod');

const envSchema = z.object({
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  NODE_ENV: z.enum(['developement', 'test', 'production']),
});

module.exports.envSchema = envSchema;

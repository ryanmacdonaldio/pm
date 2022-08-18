// Must be a .js file to be included in next.config.js

const { envSchema } = require('./env-schema');

const env = envSchema.safeParse(process.env);

module.exports.env = env.data;

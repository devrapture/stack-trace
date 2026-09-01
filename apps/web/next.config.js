/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js';

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ['shared-types'],
  allowedDevOrigins: ['web.localhost', '*.web.localhost'],
  output: 'standalone',
};

export default config;

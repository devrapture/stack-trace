export const LOG_REDACTION_PATHS = Object.freeze([
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-guest-capability"]',
  'req.headers["x-csrf-token"]',

  'request.headers.authorization',
  'request.headers.cookie',
  'request.headers["x-guest-capability"]',
  'request.headers["x-csrf-token"]',

  'headers.authorization',
  'headers.cookie',
  'headers["x-guest-capability"]',
  'headers["x-csrf-token"]',

  'authorization',
  'cookie',

  'password',
  'currentPassword',
  'newPassword',
  'passwordHash',

  'otp',
  'otpHash',

  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',

  'guestCapabilityToken',
  'guest_capability_token',

  'authorizationCode',
  'authorization_code',

  'providerAccessToken',
  'provider_access_token',

  '*.password',
  '*.currentPassword',
  '*.newPassword',
  '*.otp',
  '*.accessToken',
  '*.access_token',
  '*.refreshToken',
  '*.refresh_token',
  '*.guestCapabilityToken',
  '*.guest_capability_token',
]);

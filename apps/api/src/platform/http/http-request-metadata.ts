import type { FastifyRequest } from 'fastify';
import { isSafeRequestId, REQUEST_ID_HEADER } from './request-id.js';
export const getHttpRequestId = (req: FastifyRequest): string => {
  const headerValue = req.headers[REQUEST_ID_HEADER];
  if (isSafeRequestId(headerValue)) {
    return headerValue;
  }
  return String(req.id);
};

export const getHttpRoutePattern = (req: FastifyRequest): string => {
  if (req.is404) {
    return 'unmatched';
  }
  return String(req.routeOptions.url);
};

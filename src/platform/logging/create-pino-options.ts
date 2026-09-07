import { Params } from 'nestjs-pino';
import { hostname } from 'os';
import { Options as PinoHttpOptions } from 'pino-http';
import { AppConfig } from '../config/app-config.js';
import { REQUEST_ID_HEADER, resolveRequestId } from '../http/request-id.js';
import { LOG_REDACTION_PATHS } from './log-redaction.js';

const createCommonPinoHttpOptions = (config: AppConfig): PinoHttpOptions => {
  return {
    level: config.logLevel,

    base: {
      pid: process.pid,
      hostname: hostname(),
      service: 'stack-trace-backend',
      environment: config.nodeEnvironment,
    },

    formatters: {
      level(label) {
        return { level: label };
      },
    },

    redact: {
      paths: [...LOG_REDACTION_PATHS],
      censor: '[REDACTED]',
    },

    autoLogging: false,

    quietReqLogger: true,
    quietResLogger: true,

    customAttributeKeys: {
      reqId: 'request_id',
    },

    genReqId(request, response): string {
      const requestId = resolveRequestId(request.headers[REQUEST_ID_HEADER]);

      response.setHeader(REQUEST_ID_HEADER, requestId);

      return requestId;
    },
  };
};

export const createPinoOptions = (config: AppConfig): Params => {
  const commonOptions = createCommonPinoHttpOptions(config);

  if (!config.logPretty) {
    return {
      pinoHttp: commonOptions,
    };
  }

  return {
    pinoHttp: {
      ...commonOptions,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    },
  };
};

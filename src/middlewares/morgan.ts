import { URL } from 'url';
import { getConsoleLogger } from '@libs/consoleLogger';
import morgan from 'morgan';
import { Request } from 'express';

const inboundLogger = getConsoleLogger('inboundLogging');
const headerLogger = getConsoleLogger('headerLogging');
const parameterLogger = getConsoleLogger('parameterLogging');
inboundLogger.addContext('requestType', 'HttpLogging');
headerLogger.addContext('requestType', 'HttpLogging');
parameterLogger.addContext('requestType', 'HttpLogging');

const requestFormat = '[:method :url HTTP/:http-version] Started for :remote-addr';
const headerFormat = ':req-headers';
const parameterFormat = ':params';
const responseFormat = 'Completed :status in :response-time[1] ms';

morgan.token('params', (req: Request, res) => {
  if (req.method === 'GET') {
    const params: { [k: string]: string } = {};
    new URL(
      req.protocol + '://' + req.get('host') + req.originalUrl,
    ).searchParams.forEach((v, k) => (params[k] = v));

    return JSON.stringify(params);
  }
  return JSON.stringify({ ...req.body, ...req.fields, ...req.files });
});

morgan.token('req-headers', (req: Request, res) => {
  return JSON.stringify(req.headers);
});

export const morganLogger = () => {
  return [
    morgan(requestFormat, {
      immediate: true,
      stream: {
        write: (str) => { inboundLogger.info(str.substring(0, str.lastIndexOf('\n'))); },
      },
    }),
    morgan(headerFormat, {
      immediate: true,
      stream: {
        write: (str) => { headerLogger.info(str.substring(0, str.lastIndexOf('\n'))); },
      },
    }),
    morgan(parameterFormat, {
      immediate: true,
      stream: {
        write: (str) => { parameterLogger.info(str.substring(0, str.lastIndexOf('\n'))); },
      },
    }),
    morgan(responseFormat, {
      stream: {
        write: (str) => { inboundLogger.info(str.substring(0, str.lastIndexOf('\n'))); },
      },
    }),
  ];
};

import { addLayout, configure, getLogger } from 'log4js';

addLayout('json', () => {
  return (logEvent) => {
    return JSON.stringify(logEvent, null, 2);
  };
});

export const configureLogging = (level: string) => {
  configure({
    appenders: {
      out: { type: 'stdout', layout: { type: 'pattern', separator: ',' } },
    },
    categories: {
      default: { appenders: ['out'], level: level },
    },
  });
};

configureLogging(process.env.NODE_ENV === 'Production' ? 'info' : 'debug');
const logger = getLogger();

if (process.env.NODE_ENV !== 'Production') {
  logger.debug(`Logging initialized at ${process.env.NODE_ENV === 'Production' ? 'info' : 'debug'} level`);
}

export const getCustomLogger = (fileName?: string) => {
  return getLogger(fileName ? fileName : undefined);
};

export default logger;

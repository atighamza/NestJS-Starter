import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl, ip, headers, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const duration = Date.now() - start;
      const userAgent = headers['user-agent'] || '';

      // Color-coded status
      let statusColor: (text: string) => string;
      if (statusCode >= 500) statusColor = chalk.red;
      else if (statusCode >= 400) statusColor = chalk.yellow;
      else if (statusCode >= 300) statusColor = chalk.cyan;
      else statusColor = chalk.green;

      const timestamp = new Date().toISOString();

      // Log message
      const logMessage = [
        `${chalk.gray(`[${timestamp}]`)}`,
        `${chalk.magenta(method)}`,
        `${chalk.white(originalUrl)}`,
        statusColor(statusCode.toString()),
        `${chalk.cyan(`${duration}ms`)}`,
        `${chalk.gray(`len=${contentLength}`)}`,
        `${chalk.gray(ip)}`,
      ].join(' ');

      this.logger.log(logMessage);

      // Optional: log body for debugging (only for non-GET)
      if (
        ['POST', 'PUT', 'PATCH'].includes(method) &&
        Object.keys(body).length
      ) {
        this.logger.debug(
          `${chalk.gray('Request body:')} ${chalk.white(JSON.stringify(body))}`,
        );
      }

      // Optional: show user-agent
      this.logger.verbose(`${chalk.gray('UA:')} ${chalk.white(userAgent)}`);
    });

    next();
  }
}

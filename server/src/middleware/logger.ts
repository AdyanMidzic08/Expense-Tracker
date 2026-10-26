import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const status = res.statusCode;
    const duration = Date.now() - start;
    const line = `${status} ${req.method} ${req.originalUrl} (${duration}ms)`;

    if (status >= 400) {
      console.error(`[ERROR] ${line}`);
    } else if (status === 304) {
      console.log(`[CACHED] ${line}`);
    } else {
      console.log(`[OK] ${line}`);
    }
  });

  next();
}
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  
  // Log request payload
  console.log(`[${new Date().toISOString()}] REQUEST: ${req.method} ${req.path}`);
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  if (req.query && Object.keys(req.query).length > 0) {
    console.log('Request query:', JSON.stringify(req.query, null, 2));
  }
  
  // Store original res.json to intercept response payload
  const originalJson = res.json;
  res.json = function(data: any) {
    // Log response payload
    console.log(`[${new Date().toISOString()}] RESPONSE: ${req.method} ${req.path} ${res.statusCode}`);
    console.log('Response headers:', JSON.stringify(res.getHeaders(), null, 2));
    console.log('Response body:', JSON.stringify(data, null, 2));
    
    return originalJson.call(this, data);
  };
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] COMPLETED: ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    console.log('---');
  });
  
  next();
}

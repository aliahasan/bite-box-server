import tryCatchAsync from '../utils/tryCatchAsync';

export const parsedBody = tryCatchAsync(async (req, res, next) => {
  if (!req.body.data) {
    throw new Error('Invalid');
  }
  req.body = JSON.parse(req.body.data);
  next();
});

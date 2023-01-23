import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { response } from './response';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token)
    return response(res, 401, [], { message: 'you are not authenticated!' });
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return response(res, 403, [], { message: 'token is not valid!' });
    next(user);
  });
};

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, (user) => {
    if (user._id == req.params.id || user.isAdmin) {
      next();
    } else {
      return response(res, 403, [], { message: 'you are not authorized!' });
    }
  });
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, (user) => {
    if (user.isAdmin) {
      next();
    } else {
      return response(res, 403, [], { message: 'you are not authorized!' });
    }
  });
};

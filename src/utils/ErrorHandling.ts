import { NextFunction, Request, Response } from 'express';

class ErrorHandling {
  serverError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || 'something went wrong';
    return res.status(errorStatus).json({
      status: errorStatus,
      message: errorMessage,
    });
  }

  clientError(req: Request, res: Response): Response {
    return res.status(404).json({
      status: 404,
      message: 'not found!',
    });
  }
}

export default new ErrorHandling();

import { Response } from 'express';

export const response = (
  res: Response,
  code: number,
  data: Array<any>,
  meta = {}
) => {
  res.status(code).json({
    meta: {
      code,
      ...meta,
    },
    data,
  });
};

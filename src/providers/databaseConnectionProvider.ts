import httpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import dataSource from '../database/dataSource';

const connectionChecker = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!dataSource.isInitialized) await dataSource.initialize();
    next();
  } catch (error) {
    res.status(httpStatus.EXPECTATION_FAILED).json({
      success: false,
      message: `Something went wrong, please try again later or contact SteamCup support for help !!!`
    });
  }
};

export default connectionChecker;

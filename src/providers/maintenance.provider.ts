import dotenv from 'dotenv';
import moment from 'moment';
import { find, get } from 'lodash';
import httpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export const isMaintenance = () => {
  const currentTime = moment().utcOffset('+0800').hour();
  const timeRange = process.env.MAINTENANCE_TIME_RANGE.trim().split(',');
  return !!find(timeRange, (el) => el === currentTime.toString());
};

export const maintenanceStartTime = () => {
  const timeRange = process.env.MAINTENANCE_TIME_RANGE.trim().split(',');
  return `${get(timeRange, 0)}:00 AM`;
};

export const maintenanceEndTime = () => {
  const timeRange = process.env.MAINTENANCE_TIME_RANGE.trim().split(',');
  return `${get(timeRange, timeRange.length - 1)}:00 AM`;
};

const maintenanceChecker = (_: Request, res: Response, next: NextFunction) => {
  isMaintenance()
    ? res.status(httpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        data: {
          startTime: maintenanceStartTime(),
          endTime: maintenanceEndTime()
        }
      })
    : next();
};

export default maintenanceChecker;

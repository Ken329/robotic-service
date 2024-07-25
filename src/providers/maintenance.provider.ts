import dotenv from 'dotenv';
import { find, get } from 'lodash';
import httpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

export const isMaintenance = () => {
  const currentTime = new Date().getHours();
  const timeRange = process.env.MAINTENANCE_TIME_RANGE.trim().split(',');
  return !!find(timeRange, (el) => el === currentTime.toString());
};

const maintenanceStartTime = () => {
  const timeRange = process.env.MAINTENANCE_TIME_RANGE.trim().split(',');
  return get(timeRange, 0);
};

const maintenanceEndTime = () => {
  const timeRange = process.env.MAINTENANCE_TIME_RANGE.trim().split(',');
  return get(timeRange, timeRange.length - 1);
};

const maintenanceChecker = (_: Request, res: Response, next: NextFunction) => {
  isMaintenance()
    ? res.status(httpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message: `Robotic Service is having a downline from ${maintenanceStartTime()}:00 PM to ${maintenanceEndTime()}:00 AM everyday`
      })
    : next();
};

export default maintenanceChecker;

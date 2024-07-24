import dotenv from 'dotenv';
import moment from 'moment';
import httpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const startTime = Number(process.env.MAINTENANCE_START_TIME);
const endTime = Number(process.env.MAINTENANCE_END_TIME);

export const isMaintenance = () => {
  const startDate = moment().set({ hour: startTime, minutes: 0, second: 0 });
  const endDate = moment()
    .add(1, 'd')
    .set({ hour: endTime, minute: 0, second: 0 });
  const maintenanceCheck = moment().isBetween(startDate, endDate);
  console.log(
    `Maintenance from ${startDate.format('DD MMM YYYY hh:MM:ss A')} to ${endDate.format('DD MMM YYYY hh:MM:ss A')}`
  );
  return maintenanceCheck;
};

const maintenanceChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  isMaintenance()
    ? res.status(httpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message: `Robotic Service is having a downline from ${startTime}:00 PM to ${endTime}:00 AM everyday`
      })
    : next();
};

export default maintenanceChecker;

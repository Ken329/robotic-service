import httpStatus from 'http-status-codes';
import Express, { Application, Request, Response } from 'express';
import {
  isMaintenance,
  maintenanceEndTime,
  maintenanceStartTime
} from './providers/maintenance.provider';

const route: Application = Express();

route.get('/api/maintenance', (_: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    data: isMaintenance()
      ? {
          startTime: maintenanceStartTime(),
          endTime: maintenanceEndTime()
        }
      : null
  });
});

export default route;

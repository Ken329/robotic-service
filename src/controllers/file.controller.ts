import { Request, Response } from 'express';
import FileService from '../services/file.service';
import { errorApiResponse } from '../utils/helpers';

const file = async (req: Request, res: Response) => {
  return FileService.file(req.params.id)
    .then((data) => {
      res.type(data.type);
      res.header('Content-Disposition', `attachment; filename="${data.name}"`);
      res.send(Buffer.from(data.file, 'base64'));
    })
    .catch((error) => errorApiResponse(res, error.message));
};

export default { file };

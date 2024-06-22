import { Request, Response } from 'express';
import FileService from '../services/file.service';
import { successApiResponse, errorApiResponse } from '../utils/helpers';

const find = async (req: Request, res: Response) =>
  FileService.find(req.params.id)
    .then((data) => {
      res.type(data.type);
      res.header('Content-Disposition', `attachment; filename="${data.name}"`);
      res.send(Buffer.from(data.file, 'base64'));
    })
    .catch((error) => errorApiResponse(res, error.message));

const findAll = async (req: Request, res: Response) =>
  FileService.findAll()
    .then((data) => successApiResponse(res, 'Successfully create file', data))
    .catch((error) => errorApiResponse(res, error.message));

const create = async (req: Request, res: Response) =>
  FileService.create(req.file)
    .then((data) =>
      successApiResponse(res, 'Successfully create file', { data: data.url })
    )
    .catch((error) => errorApiResponse(res, error.message));

const remove = async (req: Request, res: Response) =>
  FileService.delete(req.params.id)
    .then((data) => successApiResponse(res, 'Successfully remove file', data))
    .catch((error) => errorApiResponse(res, error.message));

const generateExcel = async (req: Request, res: Response) =>
  FileService.generateExcel()
    .then((data) => {
      res.type('application/vnd.ms-excel');
      res.set('Content-Disposition', 'attachment; filename=students.xlsx');
      res.send(data);
    })
    .catch((error) => errorApiResponse(res, error.message));

export default { find, findAll, create, remove, generateExcel };

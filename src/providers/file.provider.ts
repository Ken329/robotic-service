import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import { find, set } from 'lodash';
import { VALID_FILE_TYPE, VALID_FILE_MIME_TYPE } from '../utils/constant';

const storage = multer.memoryStorage();

const checkFileType = (
  req: Request,
  file: { originalname: string; mimetype: string },
  cb: Function
) => {
  const extname = find(
    VALID_FILE_TYPE,
    (type) => type === path.extname(file.originalname).toLowerCase()
  );
  const mimetype = find(VALID_FILE_MIME_TYPE, (type) => type === file.mimetype);

  set(req.body, 'extNameValidator', !!extname);
  set(req.body, 'mimeTypeValidator', !!mimetype);

  return cb(null, true);
};

export default multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req: Request, file, cb) => {
    checkFileType(req, file, cb);
  }
});

import path from 'path';
import multer from 'multer';
import { find } from 'lodash';
import { Request } from 'express';
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

  if (!extname)
    cb(`Wrong file type being uploaded (${VALID_FILE_TYPE.join(', ')})`);

  if (!mimetype)
    cb(
      `Wrong file mime type being uploaded (${VALID_FILE_MIME_TYPE.join(', ')})`
    );

  return cb(null, true);
};

export default multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req: Request, file, cb) => {
    checkFileType(req, file, cb);
  }
});

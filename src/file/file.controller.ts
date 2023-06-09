import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction, response } from 'express';
import _ from 'lodash';
import { createFile, findFileById } from './file.service';

// 上传文件
export const store = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: uid } = req.user;
  const { post: pid } = req.query;
  const user_id = parseInt(uid, 10);
  const post_id = parseInt(pid as string, 10);
  const fileInfo = _.pick(req.file, [
    'originalname',
    'mimetype',
    'filename',
    'size',
  ]);

  try {
    const data = await createFile({
      ...fileInfo,
      user_id,
      post_id,
      ...req.fileMetadata,
    });

    res.status(201).send(data);
  } catch (err) {
    next(err);
  }
};

// 文件服务
export const serve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 从地址参数里得到文件 ID
  const { fileId } = req.params;

  try {
    // 查找文件信息
    const file = await findFileById(parseInt(fileId, 10));
    // 要提供的图像尺寸
    const { size } = req.query;
    // 文件名与目录
    let filename = file.filename;
    let root = 'uploads';
    let resized = 'resized';

    if (size) {
      const imageSizes = ['large', 'medium', 'small'];
      // 检查文件尺寸是否可用
      if (!imageSizes.some(item => item === size)) {
        throw new Error('FILE_NOT_FOUND');
      }
      // 检查文件是否存在
      const fileExist = fs.existsSync(
        path.join(root, resized, `${filename}-${size}`),
      );
      // 设置文件名与目录
      if (fileExist) {
        filename = `${filename}-${size}`;
        root = path.join(root, resized);
      }
    }

    // 作出响应
    res.sendFile(filename, {
      root,
      headers: {
        'Content-type': file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
};

// 文件信息
export const metadata = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fileId } = req.params;

  try {
    const file = await findFileById(parseInt(fileId, 10));
    const data = _.pick(file, ['id', 'size', 'width', 'height', 'metadata']);
    res.send(data);
  } catch (err) {
    next(err);
  }
};

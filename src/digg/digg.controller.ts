import { Request, Response, NextFunction } from 'express';
import { createUserDiggPost, deleteUserDiggPost } from './digg.service';

/**
 * 点赞内容
 */
export const storeUserDiggPost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { post_id } = request.params;
  const { id: userId } = request.user;
  const user_id = parseInt(userId, 10);

  // 点赞内容
  try {
    const data = await createUserDiggPost(user_id, parseInt(post_id, 10));

    // 做出响应
    response.status(201).send(data);
  } catch (error) {
    next(error);
  }
};

/**
 * 取消点赞内容
 */
export const destroyUserDiggPost = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  // 准备数据
  const { post_id } = request.params;
  const { id: userId } = request.user;
  const user_id = parseInt(userId, 10);

  // 取消点赞内容
  try {
    const data = await deleteUserDiggPost(user_id, parseInt(post_id, 10));

    // 做出响应
    response.send(data);
  } catch (error) {
    next(error);
  }
};

import { Request, Response } from 'express';
import User from '../models/User';

export async function me(req: Request, res: Response) {
  return res.json({
    data: req.user,
  });
}

export async function list(_: Request, res: Response) {
  return res.json({
    data: await User.find(),
  });
}

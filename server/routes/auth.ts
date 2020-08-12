import { Router } from 'express';
import { authenticate } from '../../services/passport';
import jwt from 'jsonwebtoken';
import { JWTSecret, JWTExpiresIn } from '../constants';

const router = Router();

router.post('/signup', (req, res, next) =>
  authenticate('signup', async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        detail: info,
      });
    }

    return res.json({
      data: user,
    });
  })(req, res, next)
);

router.post('/signin', (req, res, next) =>
  authenticate('signin', async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        detail: info,
      });
    }

    req.login(user, { session: false }, async (error) => {
      if (error) return next(error);

      const payload = { _id: user._id, name: user.name };
      const token = jwt.sign(payload, JWTSecret!, { expiresIn: JWTExpiresIn });

      return res.json({
        token,
        data: user,
      });
    });
  })(req, res, next)
);

export default router;

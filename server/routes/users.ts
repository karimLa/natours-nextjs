import { Router } from 'express';
import * as users from '../controllers/users';
import { authenticate } from '../../services/passport';

const router = Router();

router.get('/me', authenticate('jwt'), users.me);
router.get('/', users.list);

export default router;

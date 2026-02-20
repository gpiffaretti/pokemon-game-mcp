import { Router } from 'express';
import * as gameController from '../controllers/gameController';

const router = Router();

router.post('/', gameController.createGame);
router.get('/:gameId', gameController.getGame);
router.post('/:gameId/finish', gameController.finishGame);

export default router;

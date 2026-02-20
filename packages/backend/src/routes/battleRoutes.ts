import { Router } from 'express';
import * as battleController from '../controllers/battleController';

const router = Router();

router.post('/:gameId/start', battleController.startBattle);
router.post('/:gameId/move', battleController.performMove);
router.post('/:gameId/flee', battleController.flee);
router.post('/:gameId/catch', battleController.throwPokeball);

export default router;

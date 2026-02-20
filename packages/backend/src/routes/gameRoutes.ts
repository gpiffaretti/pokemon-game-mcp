import { Router } from 'express';
import * as gameController from '../controllers/gameController';
import * as pokemonController from '../controllers/pokemonController';

const router = Router();

router.post('/', gameController.createGame);
router.get('/starter-options', pokemonController.getStarterOptions);
router.get('/:gameId', gameController.getGame);
router.post('/:gameId/finish', gameController.finishGame);

export default router;

import { Router } from 'express';
import * as areaController from '../controllers/areaController';

const router = Router();

router.get('/:gameId/current', areaController.getCurrentArea);
router.put('/:gameId/move', areaController.moveToArea);
router.post('/:gameId/explore', areaController.findPokemonInArea);

export default router;

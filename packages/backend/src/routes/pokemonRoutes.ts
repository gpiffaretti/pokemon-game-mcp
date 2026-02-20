import { Router } from 'express';
import * as pokemonController from '../controllers/pokemonController';

const router = Router();

router.get('/:gameId/captured', pokemonController.getCapturedPokemon);
router.get('/:gameId/current', pokemonController.getCurrentPokemon);
router.put('/:gameId/current', pokemonController.setCurrentPokemon);
router.get('/:gameId/current/moves', pokemonController.getMovesForCurrentPokemon);

export default router;

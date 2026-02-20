import { Router } from 'express';
import * as pokemonController from '../controllers/pokemonController';

const router = Router();

router.get('/:gameId/captured', pokemonController.getCapturedPokemon);
router.get('/:gameId/starting', pokemonController.getStartingPokemon);
router.put('/:gameId/starting', pokemonController.setStartingPokemon);
router.get('/:gameId/starting/moves', pokemonController.getMovesForStartingPokemon);

export default router;

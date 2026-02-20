import { Router } from 'express';
import * as pokedexController from '../controllers/pokedexController';

const router = Router();

router.get('/pokemon/:nameOrId', pokedexController.getPokemon);
router.get('/area/:areaId', pokedexController.getArea);

export default router;

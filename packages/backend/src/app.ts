import express from 'express';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import gameRoutes from './routes/gameRoutes';
import pokemonRoutes from './routes/pokemonRoutes';
import areaRoutes from './routes/areaRoutes';
import battleRoutes from './routes/battleRoutes';
import pokedexRoutes from './routes/pokedexRoutes';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/games', pokemonRoutes);
app.use('/api/v1/games', areaRoutes);
app.use('/api/v1/games', battleRoutes);
app.use('/api/v1/pokedex', pokedexRoutes);

app.use(errorHandler);

export default app;

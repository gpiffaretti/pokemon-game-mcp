import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiGet, apiPost } from '../client/apiClient';
import { endpoints } from '../client/endpoints';
import { Game } from '../types/game';
import { formatGame } from '../utils/formatters';
import { formatError } from '../utils/errors';

export function registerGameTools(server: McpServer): void {
  server.registerTool(
    'start_game',
    { description: 'Start a new game session. Returns the new gameId.' },
    async () => {
      try {
        const game: Game = await apiPost(endpoints.games.create());
        return { content: [{ type: 'text' as const, text: `New game started!\n${formatGame(game)}` }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'get_game_status',
    {
      description: 'Get the current state and area of a game.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const game: Game = await apiGet<Game>(endpoints.games.get(gameId));
        return { content: [{ type: 'text' as const, text: formatGame(game) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'finish_game',
    {
      description: 'Declare the game complete.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const game: Game = await apiPost(endpoints.games.finish(gameId));
        return { content: [{ type: 'text' as const, text: `Game finished!\n${formatGame(game)}` }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );
}

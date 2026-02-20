import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { apiGet, apiPost, apiPut } from '../client/apiClient';
import { endpoints } from '../client/endpoints';
import { Area } from '../types/area';
import { Pokemon } from '../types/pokemon';
import { formatArea, formatPokemon } from '../utils/formatters';
import { formatError } from '../utils/errors';

export function registerAreaTools(server: McpServer): void {
  server.registerTool(
    'get_current_area',
    {
      description: "Get the player's current area.",
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const area = await apiGet<Area>(endpoints.area.current(gameId));
        return { content: [{ type: 'text' as const, text: formatArea(area) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'move_to_area',
    {
      description: 'Navigate the player to a different area.',
      inputSchema: z.object({
        gameId: z.string().describe('The game ID'),
        areaId: z.number().int().describe('The area ID to move to'),
      }),
    },
    async ({ gameId, areaId }) => {
      try {
        const area = await apiPut<Area>(endpoints.area.move(gameId), { areaId });
        return { content: [{ type: 'text' as const, text: `Moved to ${formatArea(area)}` }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );

  server.registerTool(
    'explore_area',
    {
      description: 'Find a random wild Pokemon in the current area.',
      inputSchema: z.object({ gameId: z.string().describe('The game ID') }),
    },
    async ({ gameId }) => {
      try {
        const pokemon = await apiPost<Pokemon>(endpoints.area.explore(gameId));
        return {
          content: [
            {
              type: 'text' as const,
              text: `A wild Pokemon appeared!\n${formatPokemon(pokemon)}`,
            },
          ],
        };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Error: ${formatError(err)}` }] };
      }
    },
  );
}
